import {
    describe,
    it,
    expect,
} from "vitest"

import { Readable } from "stream"

import { bufferTillDelimiterTransform } from "./top-info-transform"

describe("bufferTillDelimiterTransform", () => {
    it("should buffer the input", async () => {
        const getAllDataFromStream = (input: string[]) => {
            return new Promise(resolve => {
                let output = []

                const rawDataStream = Readable.from("")
                input.forEach(msg => rawDataStream.push(msg))

                rawDataStream.pipe(
                    bufferTillDelimiterTransform(/(?=^top)/gm)
                )
                .on("data", (data) => {
                    console.log(data)
                    output.push(data)
                })
                .on("end", () => {
                    console.log("end")
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

`
        ]

        const actual = await getAllDataFromStream(input)
        console.log(actual)
        expect(actual).toStrictEqual(expected)
    })
})