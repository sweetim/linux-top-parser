import {
    describe,
    it,
    expect,
} from "vitest"

import { Readable } from "stream"

import {
    bufferTillNextHeader,
    parseTopInfoTransformOptions,
    TopInfoTransformConfig,
    TopInfoTransformOptions
} from "./top-info-transform"

describe("parseTopInfoTransformOptions", () => {
    it("should return default value when no option is input", () => {
        const expected: TopInfoTransformConfig = {
            isStringify: false,
            isPrettify: false,
            isSummary: false,
            isFilter: false
        }

        expect(parseTopInfoTransformOptions()).toStrictEqual(expected)
        expect(parseTopInfoTransformOptions(<TopInfoTransformOptions>{})).toStrictEqual(expected)
    })

    it("should return isStringify false only", () => {
        const input: TopInfoTransformOptions = {
            stringify: false
        }

        const expected: TopInfoTransformConfig = {
            isStringify: false,
            isPrettify: false,
            isSummary: false,
            isFilter: false
        }

        expect(parseTopInfoTransformOptions(input)).toStrictEqual(expected)
    })

    it.each(<TopInfoTransformOptions[]>[
        {
            stringify: true
        },
        {
            stringify: {}
        }
    ])("should return isStringify true only (%s)", (input) => {
        const expected: TopInfoTransformConfig = {
            isStringify: true,
            isPrettify: false,
            isSummary: false,
            isFilter: false
        }

        expect(parseTopInfoTransformOptions(input)).toStrictEqual(expected)
    })

    it("should return isPrettify true only", () => {
        const input: TopInfoTransformOptions = {
            stringify: {
                prettify: true
            }
        }

        const expected: TopInfoTransformConfig = {
            isStringify: true,
            isPrettify: true,
            isSummary: false,
            isFilter: false
        }

        expect(parseTopInfoTransformOptions(input)).toStrictEqual(expected)
    })

    it.each(<TopInfoTransformOptions[]>[
        {
            stringify: {
                prettify: false
            }
        },
        {
            stringify: {}
        }
    ])("should return isPrettify false only (%s)", (input) => {
        const expected: TopInfoTransformConfig = {
            isStringify: true,
            isPrettify: false,
            isSummary: false,
            isFilter: false
        }

        expect(parseTopInfoTransformOptions(input)).toStrictEqual(expected)
    })

    it.each([
        true,
        false
    ])("should return isSummary same as configured (%s)", (summary) => {
        const input: TopInfoTransformOptions = {
            summary
        }

        const expected: TopInfoTransformConfig = {
            isStringify: false,
            isPrettify: false,
            isSummary: summary,
            isFilter: false
        }

        expect(parseTopInfoTransformOptions(input)).toStrictEqual(expected)
    })

    it.each([
        true,
        false
    ])("should return isFilter same as configured (%s)", (filter) => {
        const input: TopInfoTransformOptions = {
            filter
        }

        const expected: TopInfoTransformConfig = {
            isStringify: false,
            isPrettify: false,
            isSummary: false,
            isFilter: filter
        }

        expect(parseTopInfoTransformOptions(input)).toStrictEqual(expected)
    })
})

describe("bufferTillNextHeader", () => {
    it("should buffer the input until next header", async () => {
        const getAllDataFromStream = (input: string[]) => {
            return new Promise(resolve => {
                /* eslint-disable @typescript-eslint/no-explicit-any */
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
