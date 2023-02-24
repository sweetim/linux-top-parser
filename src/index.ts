import { parse } from "date-fns"

interface UpTimeAndLoadAverage {
    time: Date
    upTime_s: number
    totalNumberOfUsers: number
    loadAverageLast_1_min: number
    loadAverageLast_5_min: number
    loadAverageLast_15_min: number
}

function parseUpTime_s(input: string): number {
    const date = parse(input, "H:mm", new Date())
    const hours = date.getHours()
    const minutes = date.getMinutes()

    if (isNaN(hours) || isNaN(minutes)) {
        throw new Error("Invalid string format")
    }

    return (hours * 3600) + (minutes * 60)
}

if (import.meta.vitest) {
    const { describe, it, expect } = import.meta.vitest

    describe("parseUpTime_s", () => {
        it("can parse correctly with normal input", () => {
            const input = "23:56"
            const expected = 86160

            expect(parseUpTime_s(input)).toBe(expected)
        })

        it("will throw error when received empty input", () => {
            const input = ""
            expect(() => parseUpTime_s(input)).toThrowError()
        })
    })
}

function parseUpTimeAndLoadAverage(line: string): UpTimeAndLoadAverage {
    const matcher = /top\s*-\s*([\d|:]*)\s*up\s*([\d|:]*),\s*(\d.*)\susers,.*:\s*(\d.*),\s*(\d.*),\s*(\d.*)/gm
    const tokens = Array.from(line.matchAll(matcher)).flat()

    if (tokens?.length !== 7) {
        throw new Error("Invalid string format")
    }

    return {
        time: parse(tokens[1], "HH:mm:ss", new Date()),
        upTime_s: parseUpTime_s(tokens[2]),
        totalNumberOfUsers: Number(tokens[3]),
        loadAverageLast_1_min: Number(tokens[4]),
        loadAverageLast_5_min: Number(tokens[5]),
        loadAverageLast_15_min: Number(tokens[6])
    }
}

if (import.meta.vitest) {
    const { describe, it, expect } = import.meta.vitest

    describe("parseUpTimeAndLoadAverage", () => {
        it("can parse correctly with normal input", () => {
            const input = "top - 15:29:37 up 15:54,  1 users,  load average: 0.14, 0.07, 0.06"

            const expected: UpTimeAndLoadAverage = {
                time: parse("15:29:37", "HH:mm:ss", new Date()),
                upTime_s: 57240,
                totalNumberOfUsers: 1,
                loadAverageLast_1_min: 0.14,
                loadAverageLast_5_min: 0.07,
                loadAverageLast_15_min: 0.06
            }

            expect(parseUpTimeAndLoadAverage(input)).toStrictEqual(expected)
        })

        it("will throw error when received empty input", () => {
            const input = ""
            expect(() => parseUpTimeAndLoadAverage(input)).toThrowError()
        })
    })
}

interface TaskStates {
    total: number
    running: number
    sleeping: number
    stopped: number
    zombie: number
}

function parseTaskStates(str: string): TaskStates {
    const matcher = /Tasks:\s+(\d+)\s+total,\s+(\d+)\s+running,\s+(\d+)\s+sleeping,\s+(\d+)\s+stopped,\s+(\d+)\s+zombie/;
    const tokens = str.match(matcher);

    if (!tokens) {
        throw new Error("Invalid string format")
    }

    return {
        total: Number(tokens[1]),
        running: Number(tokens[2]),
        sleeping: Number(tokens[3]),
        stopped: Number(tokens[4]),
        zombie: Number(tokens[5]),
    };
}

if (import.meta.vitest) {
    const { describe, it, expect } = import.meta.vitest

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
}

interface CpuStates {
    us: number
    sy: number
    ni: number
    id: number
    wa: number
    hi: number
    si: number
    st: number
}

function parseCpuStates(line: string): CpuStates {
    const matcher = /((\d+.\d+)\s+([^,]+))/gm
    const tokens = Array.from(line.matchAll(matcher))

    if (tokens.length === 0) {
        throw new Error("Invalid string format")
    }

    // @ts-ignore
    return Object.fromEntries(tokens
        .map(([ ,, value, key ]) => [key, Number(value)]))
}

if (import.meta.vitest) {
    const { describe, it, expect } = import.meta.vitest

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
}

interface PhysicalMemory {
    total: number
    free: number
    used: number
    buffOrCache: number
}

function parsePhysicalMemory(input: string): PhysicalMemory {
    const matcher = /MiB Mem\s+:\s+([\d.]+)\s+total,\s+([\d.]+)\s+free,\s+([\d.]+)\s+used,\s+([\d.]+)\s+buff\/cache/
    const tokens = input.match(matcher);

    if (!tokens) {
        throw new Error("Invalid string format")
    }

    return {
        total: Number(tokens[1]),
        free: Number(tokens[2]),
        used: Number(tokens[3]),
        buffOrCache: Number(tokens[4]),
    };
}

if (import.meta.vitest) {
    const { describe, it, expect } = import.meta.vitest

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
}

interface VirtualMemory {
    total: number
    free: number
    used: number
    available: number
}

function parseVirtualMemory(input: string): VirtualMemory {
    const matcher = /MiB Swap:\s+(\d+\.\d+)\s+total,\s+(\d+\.\d+)\s+free,\s+(\d+\.\d+)\s+used\.\s+(\d+\.\d+)\s+avail Mem/
    const tokens = input.match(matcher);

    if (!tokens) {
        throw new Error("Invalid string format")
    }

    return {
        total: Number(tokens[1]),
        free: Number(tokens[2]),
        used: Number(tokens[3]),
        available: Number(tokens[4]),
    };
}

if (import.meta.vitest) {
    const { describe, it, expect } = import.meta.vitest

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
}

interface SummaryDisplay {
    upTimeAndLoadAverage: UpTimeAndLoadAverage
    taskStates: TaskStates
    cpuStates: CpuStates
    physicalMemory: PhysicalMemory
    virtualMemory: VirtualMemory
}

function parseSummaryDisplay(lines: string[]): SummaryDisplay {
    return {
        upTimeAndLoadAverage: parseUpTimeAndLoadAverage(lines[0]),
        taskStates: parseTaskStates(lines[1]),
        cpuStates: parseCpuStates(lines[2]),
        physicalMemory: parsePhysicalMemory(lines[3]),
        virtualMemory: parseVirtualMemory(lines[4]) ,
    }
}

interface FieldsAndColumns {
    [field: string]: string
}

function parseTopInfoBlock(input: string) {
    const SUMMARY_DISPLAY_LINE_COUNT = 5

    const lines = input.split("\n")
    const summaryDisplay = parseSummaryDisplay(lines.splice(0, SUMMARY_DISPLAY_LINE_COUNT))

    return {
        summaryDisplay
    }
}

function splitTopInfoToMultipleBlocks(input: string): string[] {
    const matcher = /^(top)(.*(?:\n(?!top).*)*)/gm
    return input.match(matcher) || []
}

if (import.meta.vitest) {
    const { describe, it, expect } = import.meta.vitest

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
}

/**
 * Will parse the output of top linux command into an object
 * @param {string} input - the text block that contains the top output
 * @throws Will throw an error if the input is invalid format
 * @returns An object that contains all the top information
 */
export function parseTopInfo(input: string) {
    if (input.length === 0) {
        throw new Error("Empty string")
    }

    return splitTopInfoToMultipleBlocks(input)
        .map(parseTopInfoBlock)
}