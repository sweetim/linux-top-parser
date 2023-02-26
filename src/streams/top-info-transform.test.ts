import {
    describe,
    it,
    expect,
} from "vitest"

import { Readable } from "stream"

import { bufferTillNextHeader } from "./top-info-transform"

describe("bufferTillNextHeader", () => {
    it("should buffer the input until next header", async () => {
        const getAllDataFromStream = (input: string[]) => {
            return new Promise(resolve => {
                const output: any[] = []

                const rawDataStream = Readable.from("")
                input.forEach(msg => rawDataStream.push(msg))

                rawDataStream.pipe(
                    bufferTillNextHeader(/(?=^top)/gm)
                )
                .on("data", (data) => {
                    output.push(data)
                })
                .on("end", () => {
                    resolve(output)
                })
            })
        }

        const input = [
`top
abc
def
ghi
`,
`top
abc`,
`def`,
`ghi`,
`
jkl`,
`top
abc
def
ghi

top
123
456`
        ]

        const expected = [
`top
abc
def
ghi
`,
`top
abcdefghi
jkl`,
`top
abc
def
ghi

`,
`top
123
456`
        ]

        const actual = await getAllDataFromStream(input)
        expect(actual).toStrictEqual(expected)
    })
})