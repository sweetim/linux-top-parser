import { Transform } from "node:stream"

import { parseTopInfo } from ".."

/**
 * top info transform stream
 * @param toString {boolean} output top info as string
 * @returns transform stream
 */
export function topInfoTransform(toString = false): Transform {
    return bufferTillDelimiterTransform(
        /(?=^top)/gm,
        (buffer) => {
            const topInfo = parseTopInfo(buffer)

            return toString
                ? JSON.stringify(topInfo)
                : topInfo
        }
    )
}

/**
 * it will always wait for next delimiter before emitting any data
 * @param delimiter {RegEx} regular expression for delimiter
 * @param mappingFn  a mapping function
 * @returns transform stream
 */
export function bufferTillDelimiterTransform(
    delimiter: RegExp,
    mappingFn: (buffer: string) => any = (buffer: string) => buffer): Transform
{
    let buffer = ""

    return new Transform({
        objectMode: true,
        transform(chunk: Buffer, encoding, callback) {
            chunk.toString()
                .split(delimiter)
                .forEach(msg => {
                    const isDelimiter = delimiter.test(msg)

                    if (buffer && isDelimiter) {
                        this.push(mappingFn(buffer))
                        buffer = ""
                    }

                    if (isDelimiter) {
                        buffer = msg

                        return
                    }

                    buffer += msg
                })

            callback()
        },
    })
}