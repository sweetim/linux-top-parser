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
    const matcher = /%Cpu\(s\):\s+([\d|.]+)\s+us,\s+([\d|.]+)\s+sy,\s+([\d|.]+)\s+ni,\s+([\d|.]+)\s+id,\s+([\d|.]+)\s+wa,\s+([\d|.]+)\s+hi,\s+([\d|.]+)\s+si,\s+([\d|.]+)\s+st/;
    const tokens = line.match(matcher);

    if (!tokens) {
        throw new Error("Invalid string format")
    }

    return {
        us: Number(tokens[1]),
        sy: Number(tokens[2]),
        ni: Number(tokens[3]),
        id: Number(tokens[4]),
        wa: Number(tokens[5]),
        hi: Number(tokens[6]),
        si: Number(tokens[7]),
        st: Number(tokens[8]),
    };
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

        it("will return null when received empty input", () => {
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

        it("will return null when received empty input", () => {
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

function parseSummaryDisplay(input: string[]): SummaryDisplay {
    return {
        upTimeAndLoadAverage: parseUpTimeAndLoadAverage(input[0]),
        taskStates: parseTaskStates(input[1]),
        cpuStates: parseCpuStates(input[2]),
        physicalMemory: parsePhysicalMemory(input[3]),
        virtualMemory: parseVirtualMemory(input[4]) ,
    }
}

interface FieldsAndColumns {
    [field: string]: string
}

export function parseTopInfo(input: string) {
    const SUMMARY_DISPLAY_LINE_COUNT = 5

    const lines = input.split("\n")
    const totalLinesLength = lines.length

    const summaryDisplay = parseSummaryDisplay(lines.splice(0, SUMMARY_DISPLAY_LINE_COUNT))

    return {
        summaryDisplay
    }
}