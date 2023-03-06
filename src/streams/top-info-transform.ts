import { Transform } from "node:stream"

import { render } from "prettyjson"

import { parseTopInfo, TopInfo } from ".."
import { SummaryDisplay } from "../parser"

export interface TopInfoTransformOptions {
    stringify?: boolean | TopInfoTransformToStringOpions
    summary?: boolean
    filter?: boolean
    timeOut_ms?: number
}

interface TopInfoTransformToStringOpions {
    prettify?: boolean
}

export interface TopInfoTransformConfig {
    isStringify: boolean
    isPrettify: boolean
    isSummary: boolean
    isFilter: boolean
    timeOut_ms: number
}

export function parseTopInfoTransformOptions(options?: TopInfoTransformOptions): TopInfoTransformConfig {
    const output: TopInfoTransformConfig = {
        isStringify: false,
        isPrettify: false,
        isSummary: false,
        isFilter: false,
        timeOut_ms: 100
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

    if (options.timeOut_ms) {
        output.timeOut_ms = options.timeOut_ms
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
 * Transforms top information into a desired format.
 * @param {TopInfoTransformOptions} [options] - The options for the transformation.
 * @param {boolean | TopInfoTransformToStringOpions} [options.stringify] - Whether to stringify the output or not. If an object is given, it specifies additional options for stringification.
 * @param {boolean} [options.summary] - to include a summary of the top information only.
 * @param {boolean} [options.filter] - to filter process that has > 0% CPU usage.
 * @returns {Transform} A transform stream that applies the transformation to top information chunks.
 */
export function topInfoTransform(options?: TopInfoTransformOptions): Transform {
    const config = parseTopInfoTransformOptions(options)

    return bufferTillNextHeader(
        /(?=^top)/gm,
        topInfoMapping(config),
        config.timeOut_ms
    )
}

/**
 * Buffers data chunks until a header is found and then applies a mapping function to the buffer.
 * @param {RegExp} header - The regular expression that matches the header of a new chunk.
 * @param {(buffer: string) => any} [mappingFn] - The function that transforms the buffer into a desired format. By default, it returns the buffer as it is.
 * @returns {Transform} A transform stream that buffers and maps data chunks based on the header.
 */
export function bufferTillNextHeader(
    header: RegExp,
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mappingFn: (buffer: string) => any = (buffer: string) => buffer,
    timeOut_ms?: number): Transform
{
    let buffer = ""
    let timeOut_id: NodeJS.Timeout | null = null

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
                        if (buffer.trim().length > 0) {
                            this.push(mappingFn(buffer))
                            buffer = ""
                        }
                    }

                    if (isHeader) {
                        buffer = msg

                        return
                    }

                    buffer += msg
                })

            if (timeOut_id) {
                clearTimeout(timeOut_id)
                timeOut_id = null
            }

            if (timeOut_ms) {
                timeOut_id = setTimeout(() => {
                    if (buffer.trim().length > 0) {
                        this.push(mappingFn(buffer))
                        buffer = ""
                    }
                }, timeOut_ms)
            }

            cb()
        },
    })
}
