import { describe, expect, it } from "vitest"
import { readFileSync } from "fs"
import { resolve } from "path"

import { parseTopInfo } from "../src"
import { parse } from "date-fns"

describe("parseTopInfo", () => {
    it("should be able to parse top output", () => {
        const DATA_FILE_NAME = "data.txt"
        const input = readFileSync(resolve(__dirname, DATA_FILE_NAME)).toString()

        const expected = {
            summaryDisplay: {
                upTimeAndLoadAverage: {
                    time: parse("15:29:37", "HH:mm:ss", new Date()),
                    upTime_s: 57240,
                    totalNumberOfUsers: 0,
                    loadAverageLast_1_min: 0.14,
                    loadAverageLast_5_min: 0.07,
                    loadAverageLast_15_min: 0.06
                },
                taskStates: {
                    total: 60,
                    running: 1,
                    sleeping: 39,
                    stopped: 0,
                    zombie: 20
                },
                cpuStates: {
                    us: 0.4,
                    sy: 0.8,
                    ni: 0,
                    id: 98.4,
                    wa: 0,
                    hi: 0,
                    si: 0.4,
                    st: 0
                },
                physicalMemory: {
                    total: 7947.3,
                    free: 408.6,
                    used: 4257.3,
                    buffOrCache: 3281.4
                },
                virtualMemory: {
                    total: 2048,
                    free: 2048,
                    used: 0,
                    available: 3392.8
                }
            }
        }

        expect(parseTopInfo(input)).toStrictEqual(expected)
    })

    it("should throw error on empty input", () => {
        const input = ""

        expect(() => parseTopInfo(input)).toThrowError()
    })
})