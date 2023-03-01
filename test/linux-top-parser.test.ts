import { describe, expect, it } from "vitest"
import { readFileSync, createReadStream } from "fs"
import { resolve } from "path"

import { parseTopInfo, TopInfo, topInfoTransform } from "../src"

function getDataFilePath(fileName: string): string {
    const DATA_FOLDER_NAME = "data"
    return resolve(__dirname, DATA_FOLDER_NAME, fileName)
}

describe("linux-top-parser", () => {
    const createTestCase = (name: string, parsingFn: (inputFile: string) => Promise<TopInfo[]>) => {
        describe(name, () => {
            it.each([
                {
                    inputFile: "single.txt",
                    expectedFile: "single-expected.json"
                },
                {
                    inputFile: "multi.txt",
                    expectedFile: "multi-expected.json"
                },
                {
                    inputFile: "multi-all.txt",
                    expectedFile: "multi-all-expected.json"
                }
            ])("should be able to parse top output in file ($inputFile) to be same as ($expectedFile)", async ({ inputFile, expectedFile }) => {
                const expected: TopInfo[] = JSON.parse(
                    readFileSync(getDataFilePath(expectedFile)).toString()
                ).map(item => {
                    item.summaryDisplay.upTimeAndLoadAverage.time = new Date(
                        item.summaryDisplay.upTimeAndLoadAverage.time)

                    return item
                })

                const actual = await parsingFn(inputFile)
                expect(actual).toStrictEqual(expected)
            })

            it("should throw error on empty input", () => {
                // expect(() => parsingFn("")).toThrowError()
            })
        })
    }

    createTestCase(
        "parseTopInfo",
        async (inputFile) => {
            const input = readFileSync(getDataFilePath(inputFile)).toString()
            return parseTopInfo(input)
        })

    createTestCase(
        "topInfoTransform",
        async (inputFile) => {
            const getTopInfoFromStream = async (inputFile): Promise<TopInfo[]> => {
                return new Promise((resolve) => {
                    const output: TopInfo[] = []

                    createReadStream(getDataFilePath(inputFile))
                        .pipe(topInfoTransform())
                        .on("data", (data) => {
                            output.push(data)
                        })
                        .on("end", () => {
                            resolve(output)
                        })
                })
            }

            const actual = await getTopInfoFromStream(inputFile)
            return actual.flat()
        })
})
