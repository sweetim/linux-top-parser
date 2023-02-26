import { parse } from "date-fns"
import { describe, it, expect } from "vitest"

import { CpuStates,
    FieldAndColumnsDisplayType,
    FieldsValues,
    PhysicalMemory,
    TaskStates,
    TopInfoDisplayType,
    VirtualMemory
} from "./types"

import { convertIntoTopInfoDisplayType,
    parseColumnsHeader,
    parseCpuStates,
    parseFieldsValues,
    parsePhysicalMemory,
    parseTaskStates,
    parseUpTimeAndLoadAverage,
    parseUpTime_s,
    parseVirtualMemory,
    splitTopInfoToMultipleBlocks
} from "./using-regex"

describe("parseUpTime_s", () => {

    it.each([
        {
            input: "23:56",
            expected: 86160
        },
        {
            input: "1 day, 23:52",
            expected: 172320
        },
        {
            input: "2 days, 10:03",
            expected: 208980
        }
    ])("can parse correctly with normal input ($input)", ({ input, expected }) => {
        expect(parseUpTime_s(input)).toBe(expected)
    })

    it("will throw error when received empty input", () => {
        const input = ""
        expect(() => parseUpTime_s(input)).toThrowError()
    })
})

describe("parseUpTimeAndLoadAverage", () => {
    it.each([
        {
            input: "top - 14:48:52 up 2 days, 13:23,  0 users,  load average: 0.07, 0.02, 0.00",
            expected: {
                time: parse("14:48:52", "HH:mm:ss", new Date()),
                upTime_s: 220980,
                totalNumberOfUsers: 0,
                loadAverageLast_1_min: 0.07,
                loadAverageLast_5_min: 0.02,
                loadAverageLast_15_min: 0
            }
        },
        {
            input: "top - 01:18:02 up 1 day, 23:52,  1 users,  load average: 0.97, 0.33, 0.17",
            expected: {
                time: parse("01:18:02", "HH:mm:ss", new Date()),
                upTime_s: 172320,
                totalNumberOfUsers: 1,
                loadAverageLast_1_min: 0.97,
                loadAverageLast_5_min: 0.33,
                loadAverageLast_15_min: 0.17
            }
        },
        {
            input: "top - 15:29:37 up 15:54,  1 users,  load average: 0.14, 0.07, 0.06",
            expected: {
                time: parse("15:29:37", "HH:mm:ss", new Date()),
                upTime_s: 57240,
                totalNumberOfUsers: 1,
                loadAverageLast_1_min: 0.14,
                loadAverageLast_5_min: 0.07,
                loadAverageLast_15_min: 0.06
            }
        }
    ])("can parse correctly with normal input ($input)", ({ input, expected }) => {
        expect(parseUpTimeAndLoadAverage(input)).toStrictEqual(expected)
    })

    it("will throw error when received empty input", () => {
        const input = ""
        expect(() => parseUpTimeAndLoadAverage(input)).toThrowError()
    })
})

describe("parseTaskStates", () => {
    it("can parse correctly with normal input", () => {
        const input = "Tasks:  60 total,   1 running,  39 sleeping,   0 stopped,  20 zombie"

        const expected: TaskStates = {
            total: 60,
            running: 1,
            sleeping: 39,
            stopped: 0,
            zombie: 20,
        }

        expect(parseTaskStates(input)).toStrictEqual(expected)
    })

    it("will throw error when received empty input", () => {
        const input = ""
        expect(() => parseTaskStates(input)).toThrowError()
    })
})

describe("parseCpuStates", () => {
    it("can parse correctly with normal input", () => {
        const input = "%Cpu(s):  0.4 us,  0.8 sy,  0.1 ni, 98.4 id,  0.2 wa,  0.0 hi,  0.4 si,  0.3 st"

        const expected: CpuStates = {
            us: 0.4,
            sy: 0.8,
            ni: 0.1,
            id: 98.4,
            wa: 0.2,
            hi: 0,
            si: 0.4,
            st: 0.3,
        }

        expect(parseCpuStates(input)).toStrictEqual(expected)
    })

    it("will throw error when received empty input", () => {
        const input = ""
        expect(() => parseCpuStates(input)).toThrowError()
    })
})

describe("parseCpuStates", () => {
    it("can parse correctly with normal input", () => {
        const input = "%Cpu(s):  0.4 us,  0.8 sy,  0.1 ni, 98.4 id,  0.2 wa,  0.0 hi,  0.4 si,  0.3 st"

        const expected: CpuStates = {
            us: 0.4,
            sy: 0.8,
            ni: 0.1,
            id: 98.4,
            wa: 0.2,
            hi: 0,
            si: 0.4,
            st: 0.3,
        }

        expect(parseCpuStates(input)).toStrictEqual(expected)
    })

    it("will throw error when received empty input", () => {
        const input = ""
        expect(() => parseCpuStates(input)).toThrowError()
    })
})

describe("parsePhysicalMemory", () => {
    it("can parse correctly with normal input", () => {
        const input = "MiB Mem :   7947.3 total,    408.6 free,   4257.3 used,   3281.4 buff/cache"

        const expected: PhysicalMemory = {
            total: 7947.3,
            free: 408.6,
            used: 4257.3,
            buffOrCache: 3281.4
        }

        expect(parsePhysicalMemory(input)).toStrictEqual(expected)
    })

    it("will throw error when received empty input", () => {
        const input = ""
        expect(() => parsePhysicalMemory(input)).toThrowError()
    })
})

describe("parseVirtualMemory", () => {
    it("can parse correctly with normal input", () => {
        const input = "MiB Swap:   2048.0 total,   2048.0 free,      0.0 used.   3392.8 avail Mem"

        const expected: VirtualMemory = {
            total: 2048.0,
            free: 2048.0,
            used: 0.0,
            available: 3392.8
        }

        expect(parseVirtualMemory(input)).toStrictEqual(expected)
    })

    it("will throw error when received empty input", () => {
        const input = ""
        expect(() => parseVirtualMemory(input)).toThrowError()
    })
})

describe("parseColumnsHeader", () => {
    it("can parse correctly with normal input", () => {
        const input = "  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND                                                                                                                                                                                                                                                                                                                                                                                                                                                  P"
        const expected = [
            "  PID",
            " USER     ",
            " PR",
            "  NI",
            "    VIRT",
            "    RES",
            "    SHR",
            " S ",
            " %CPU",
            "  %MEM",
            "     TIME+",
            " COMMAND                                                                                                                                                                                                                                                                                                                                                                                                                                                 ",
            " P"
        ]

        const actual = parseColumnsHeader(input)
            .map(({ start, end }) => {
                return input.slice(start, end)
            })

        expect(actual).toStrictEqual(expected)
    })
})

describe("parseFieldsValues", () => {
    it("can parse correctly with normal input", () => {
        const input: FieldAndColumnsDisplayType = {
            header: "  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND                                                                                                                                                                                                                                                                                                                                                                                                                                                  P",
            fields: [
                " 8253 tim       20   0   23.8g 235884  37740 S   6.7   3.9   0:03.07 /home/tim/.nvm/versions/node/v18.12.0/bin/node --experimental-loader=file:///home/tim/.vscode-server/extensions/wallabyjs.wallaby-vscode-1.0.349/wallaby65f4bb/runners/node/hooks.mjs /home/tim/.vscode-server/extensions/wallabyjs.wallaby-vscode-1.0.349/wallaby65f4bb/server.js runner 0 40475 vitest@0.14.0,autoDetected  /home/tim/learn/linux-top-parser/node_modules /home/tim/.vscode-server/extensions/wallabyjs.wallaby-vscode-1.0.349/proje+  2",
                "    1 root      20   0    1804   1192   1104 S   0.0   0.0   0:00.02 /init                                                                                                                                                                                                                                                                                                                                                                                                                                                    0"
            ]
        }

        const expected: FieldsValues[] = [
            {
              PID: "8253",
              USER: "tim",
              PR: "20",
              NI: "0",
              VIRT: "23.8g",
              RES: "235884",
              SHR: "37740",
              S: "S",
              "%CPU": "6.7",
              "%MEM": "3.9",
              "TIME+": "0:03.07",
              COMMAND: "/home/tim/.nvm/versions/node/v18.12.0/bin/node --experimental-loader=file:///home/tim/.vscode-server/extensions/wallabyjs.wallaby-vscode-1.0.349/wallaby65f4bb/runners/node/hooks.mjs /home/tim/.vscode-server/extensions/wallabyjs.wallaby-vscode-1.0.349/wallaby65f4bb/server.js runner 0 40475 vitest@0.14.0,autoDetected  /home/tim/learn/linux-top-parser/node_modules /home/tim/.vscode-server/extensions/wallabyjs.wallaby-vscode-1.0.349/proje+",
              P: "2"
            },
            {
              PID: "1",
              USER: "root",
              PR: "20",
              NI: "0",
              VIRT: "1804",
              RES: "1192",
              SHR: "1104",
              S: "S",
              "%CPU": "0.0",
              "%MEM": "0.0",
              "TIME+": "0:00.02",
              COMMAND: "/init",
              P: "0"
            }
        ]

        expect(parseFieldsValues(input)).toStrictEqual(expected)
    })

    it("will not parse if the input is empty", () => {
        const input: FieldAndColumnsDisplayType = {
            header: "  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND                                                                                                                                                                                                                                                                                                                                                                                                                                                  P",
            fields: [
                ""
            ]
        }

        const expected: FieldsValues[] = []

        expect(parseFieldsValues(input)).toStrictEqual(expected)
    })
})

describe("convertIntoTopInfoDisplayType", () => {
    it("can parse correctly with normal input", () => {
        const input = `
top - 15:29:38 up 15:54,  0 users,  load average: 0.14, 0.07, 0.06
Tasks:  60 total,   1 running,  39 sleeping,   0 stopped,  20 zombie
%Cpu(s):  0.4 us,  0.8 sy,  0.1 ni, 98.4 id,  0.2 wa,  0.3 hi,  0.4 si,  0.0 st
MiB Mem :   7947.3 total,    408.6 free,   4257.3 used,   3281.4 buff/cache
MiB Swap:   2048.0 total,   2048.0 free,      0.0 used.   3392.8 avail Mem

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND                                                                                                                                                                                                                                                                                                                                                                                                                                                  P
 8253 tim       20   0   23.8g 235884  37740 S   6.7   3.9   0:03.07 /home/tim/.nvm/versions/node/v18.12.0/bin/node --experimental-loader=file:///home/tim/.vscode-server/extensions/wallabyjs.wallaby-vscode-1.0.349/wallaby65f4bb/runners/node/hooks.mjs /home/tim/.vscode-server/extensions/wallabyjs.wallaby-vscode-1.0.349/wallaby65f4bb/server.js runner 0 40475 vitest@0.14.0,autoDetected  /home/tim/learn/linux-top-parser/node_modules /home/tim/.vscode-server/extensions/wallabyjs.wallaby-vscode-1.0.349/proje+  2
`

        const expected: TopInfoDisplayType = {
            summary: [
                "top - 15:29:38 up 15:54,  0 users,  load average: 0.14, 0.07, 0.06",
                "Tasks:  60 total,   1 running,  39 sleeping,   0 stopped,  20 zombie",
                "%Cpu(s):  0.4 us,  0.8 sy,  0.1 ni, 98.4 id,  0.2 wa,  0.3 hi,  0.4 si,  0.0 st",
                "MiB Mem :   7947.3 total,    408.6 free,   4257.3 used,   3281.4 buff/cache",
                "MiB Swap:   2048.0 total,   2048.0 free,      0.0 used.   3392.8 avail Mem",
            ],
            fieldAndColumns: {
                header: "  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND                                                                                                                                                                                                                                                                                                                                                                                                                                                  P",
                fields: [
                    " 8253 tim       20   0   23.8g 235884  37740 S   6.7   3.9   0:03.07 /home/tim/.nvm/versions/node/v18.12.0/bin/node --experimental-loader=file:///home/tim/.vscode-server/extensions/wallabyjs.wallaby-vscode-1.0.349/wallaby65f4bb/runners/node/hooks.mjs /home/tim/.vscode-server/extensions/wallabyjs.wallaby-vscode-1.0.349/wallaby65f4bb/server.js runner 0 40475 vitest@0.14.0,autoDetected  /home/tim/learn/linux-top-parser/node_modules /home/tim/.vscode-server/extensions/wallabyjs.wallaby-vscode-1.0.349/proje+  2",
                    ""
                ]
            }
        }

        expect(convertIntoTopInfoDisplayType(input.slice(1))).toStrictEqual(expected)
    })
})

describe("convertTopInfoToMultipleBlocks", () => {
    it("can parse correctly with normal input", () => {
        const input = `
top - 15:29:37 up 15:54,  0 users,  load average: 0.14, 0.07, 0.06
Tasks:  60 total,   1 running,  39 sleeping,   0 stopped,  20 zombie

PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND                                                                                                                                                                                                                                                                                                                                                                                                                                                  P
8253 tim       20   0   23.8g 235884  37740 S   6.7   2.9   0:03.07 /home/tim/.nvm/versions/node/v18.12.0/bin/node --experimental-loader=file:///home/tim/.vscode-server/extensions/wallabyjs.wallaby-vscode-1.0.349/wallaby65f4bb/runners/node/hooks.mjs /home/tim/.vscode-server/extensions/wallabyjs.wallaby-vscode-1.0.349/wallaby65f4bb/server.js runner 0 40475 vitest@0.14.0,autoDetected  /home/tim/learn/linux-top-parser/node_modules /home/tim/.vscode-server/extensions/wallabyjs.wallaby-vscode-1.0.349/proje+  2

top - 15:29:37 up 15:54,  0 users,  load average: 0.14, 0.07, 0.06
Tasks:  60 total,   1 running,  39 sleeping,   0 stopped,  20 zombie

PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND                                                                                                                                                                                                                                                                                                                                                                                                                                                  P
8253 tim       20   0   23.8g 235884  37740 S   6.7   2.9   0:03.07 /home/tim/.nvm/versions/node/v18.12.0/bin/node --experimental-loader=file:///home/tim/.vscode-server/extensions/wallabyjs.wallaby-vscode-1.0.349/wallaby65f4bb/runners/node/hooks.mjs /home/tim/.vscode-server/extensions/wallabyjs.wallaby-vscode-1.0.349/wallaby65f4bb/server.js runner 0 40475 vitest@0.14.0,autoDetected  /home/tim/learn/linux-top-parser/node_modules /home/tim/.vscode-server/extensions/wallabyjs.wallaby-vscode-1.0.349/proje+  2
  1 root      20   0    1804   1192   1104 S   0.0   0.0   0:00.02 /init                                                                                                                                                                                                                                                                                                                                                                                                                                                    0
`

        expect(splitTopInfoToMultipleBlocks(input).length).toBe(2)
    })
})