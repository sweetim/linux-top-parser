import { describe, expect, it } from "vitest"
import { readFileSync } from "fs"
import { resolve } from "path"

import { parseTopInfo, TopInfo } from "../src"

function getDataFilePath(fileName: string): string {
    const DATA_FOLDER_NAME = "data"
    return resolve(__dirname, DATA_FOLDER_NAME, fileName)
}

describe("parseTopInfo", () => {
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
    ])("should be able to parse top output in file ($inputFile) to be same as ($expectedFile)", ({ inputFile, expectedFile }) => {
        const input = readFileSync(getDataFilePath(inputFile)).toString()

        const expected: TopInfo[] = JSON.parse(
            readFileSync(getDataFilePath(expectedFile)).toString()
        ).map(item => {
            item.summaryDisplay.upTimeAndLoadAverage.time = new Date(item.summaryDisplay.upTimeAndLoadAverage.time)
            return item
        })

        expect(parseTopInfo(input)).toStrictEqual(expected)
    })

    it("should throw error on empty input", () => {
        const input = ""

        expect(() => parseTopInfo(input)).toThrowError()
    })
})
