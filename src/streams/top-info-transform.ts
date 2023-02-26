import { Transform } from "node:stream"

import { parseTopInfo } from ".."

/**
 * top info transform stream
 * @param toString {boolean} output top info as string
 * @returns transform stream
 */
export function topInfoTransform(toString = false): Transform {
    return bufferTillNextHeader(
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
 * it will always wait for next header before emitting any data
 * @param delimiter {RegEx} regular expression for header
 * @param mappingFn  a mapping function
 * @returns transform stream
 */
export function bufferTillNextHeader(
    header: RegExp,
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