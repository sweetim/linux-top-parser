import { Transform } from "node:stream"

import { render } from "prettyjson"

import { parseTopInfo, TopInfo } from ".."
import { SummaryDisplay } from "../parser/index"

export interface TopInfoTransformOptions {
    stringify?: boolean | TopInfoTransformToStringOpions
    summary?: boolean
    filter?: boolean
}

interface TopInfoTransformToStringOpions {
    prettify?: boolean
}

export interface TopInfoTransformConfig {
    isStringify: boolean
    isPrettify: boolean
    isSummary: boolean
    isFilter: boolean
}

export function parseTopInfoTransformOptions(options?: TopInfoTransformOptions): TopInfoTransformConfig {
    const output: TopInfoTransformConfig = {
        isStringify: false,
        isPrettify: false,
        isSummary: false,
        isFilter: false,
    }

    if (options === undefined) {
        return output
    }

    if (Object.keys(options).length === 0) {
        return output
    }

    if (options.stringify) {
        output.isStringify = true
    }

    if (options.stringify !== undefined
        && typeof options.stringify !== "boolean"
        && "prettify" in options.stringify
        && typeof options.stringify.prettify === "boolean"
        && options.stringify.prettify)
    {
        output.isPrettify = options.stringify.prettify
    }

    if (options.summary) {
        output.isSummary = options.summary
    }

    if (options.filter) {
        output.isFilter = options.filter
    }

    return output
}

function topInfoMapping(config: TopInfoTransformConfig)
{
    return (buffer: string) => {
        const topInfo = parseTopInfo(buffer)

        let output: TopInfo[] | SummaryDisplay[] = topInfo

        if (config.isFilter) {
            output = topInfo.map(info => {
                const { fieldValues, ...others } = info

                return {
                    ...others,
                    fieldValues: fieldValues.filter(f => Number(f["%CPU"]) > 0)
                }
            })
        }

        if (config.isSummary) {
            output = topInfo.map(info => info.summaryDisplay)
        }

        if (config.isPrettify) {
            return render(output)
        }

        if (config.isStringify) {
            return JSON.stringify(output)
        }

        return output
    }
}

/**
 * top info transform stream
 * @param toString {boolean} output top info as string
 * @returns transform stream
 */
export function topInfoTransform(options?: TopInfoTransformOptions): Transform {
    const config = parseTopInfoTransformOptions(options)

    return bufferTillNextHeader(
        /(?=^top)/gm,
        topInfoMapping(config)
    )
}

/**
 * it will always wait for next header before emitting any data
 * @param delimiter {RegEx} regular expression for header
 * @param mappingFn  a mapping function
 * @returns transform stream
 */
export function bufferTillNextHeader(
    header: RegExp,
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mappingFn: (buffer: string) => any = (buffer: string) => buffer): Transform
{
    let buffer = ""

    return new Transform({
        objectMode: true,
        flush(cb) {
            this.push(mappingFn(buffer))
            cb()
        },
        transform(chunk: Buffer, encoding, cb) {
            chunk.toString()
                .split(header)
                .forEach(msg => {
                    const isHeader = header.test(msg)

                    if (buffer && isHeader) {
                        this.push(mappingFn(buffer))
                        buffer = ""
                    }

                    if (isHeader) {
                        buffer = msg

                        return
                    }

                    buffer += msg
                })

            cb()
        },
    })
}
