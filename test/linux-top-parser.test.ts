import { describe, expect, it } from "vitest"
import { readFileSync } from "fs"
import { Readable } from "node:stream"
import { resolve } from "path"

import { parseTopInfo, TopInfo, topInfoTransform } from "../src"

function getDataFilePath(fileName: string): string {
    const DATA_FOLDER_NAME = "data"
    return resolve(__dirname, DATA_FOLDER_NAME, fileName)
}

describe("linux-top-parser", () => {
    const prepareTestData = () => {
        const rawData = [
            "single",
            "multi",
            "multi-all"
        ]

        const getInputData = (inputFile: string) => {
            return readFileSync(getDataFilePath(inputFile)).toString()
        }

        const getExpectedData = (expectedFile: string): TopInfo[] => {
            return JSON.parse(
                readFileSync(getDataFilePath(expectedFile)).toString()
            ).map(item => {
                item.summaryDisplay.upTimeAndLoadAverage.time = new Date(
                    item.summaryDisplay.upTimeAndLoadAverage.time)

                return item
            })
        }

        return rawData
            .map(text => ({
                inputFile: `${text}.txt`,
                expectedFile: `${text}-expected.json`,
            }))
            .map(({ inputFile, expectedFile }) => ({
                inputFile,
                expectedFile,
                input: getInputData(inputFile),
                expected: getExpectedData(expectedFile)
            }))
    }

    describe("parseTopInfo", () => {
        it.each(prepareTestData())("should be able to parse top output from file ($inputFile) to be same as ($expectedFile)", ({ input, expected }) => {
            expect(parseTopInfo(input)).toStrictEqual(expected)
        })

        it("should throw error on empty input", () => {
            expect(() => parseTopInfo("")).toThrowError()
        })

    })

    describe("topInfoTransform", () => {
        it.each(prepareTestData())("should be able to parse top output from file ($inputFile) to be same as ($expectedFile)", async ({ input, expected }) => {
            const getTopInfoFromStream = async (input: string): Promise<TopInfo[]> => {
                return new Promise((resolve) => {
                    const output: TopInfo[] = []

                    Readable.from(input)
                        .pipe(topInfoTransform())
                        .on("data", (data) => {
                            output.push(data)
                        })
                        .on("end", () => {
                            resolve(output.flat())
                        })
                })
            }

            const actual = await getTopInfoFromStream(input)
            expect(actual).toStrictEqual(expected)
        })
    })
})
