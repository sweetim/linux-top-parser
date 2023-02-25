import { Transform } from "node:stream"
import { parseTopInfo } from ".."

export function topInfoTransform(toString = false): Transform {
    let buffer = ""
    const matcher = /(?=^top)/gm

    return new Transform({
        objectMode: true,
        transform(chunk: Buffer, encoding, callback) {
            const isMatch = chunk.toString().match(matcher)

            if (isMatch) {
                buffer = chunk.toString()
            } else {
                const topInfo =  parseTopInfo(buffer + chunk.toString())
                const output = toString ? JSON.stringify(topInfo) : topInfo
                this.push(output)
                buffer = ""
            }

            callback()
        },
    })
}