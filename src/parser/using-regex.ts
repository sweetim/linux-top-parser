import { parse } from "date-fns"
import {
    ColumnsHeader,
    CpuStates,
    FieldAndColumnsDisplayType,
    FieldsValues,
    PhysicalMemory,
    SummaryDisplay,
    TaskStates,
    TopInfo,
    TopInfoDisplayType,
    UpTimeAndLoadAverage,
    VirtualMemory
} from "./types"
import { fromDays, fromHours, fromMinutes } from "./util"

export function parseUpTime_s(input: string): number {
    const matcher = /((\d+) day[s]?,)?\s?(\d+:\d+)/gm
    const tokens = Array.from(input.matchAll(matcher)).flat()

    if (tokens.length === 0) {
        throw new Error(`invalid string format (${input})`)
    }

    const days = Number(tokens[2] || 0)
    const time = parse(tokens[3], "H:mm", new Date())
    const hours = time.getHours()
    const minutes = time.getMinutes()

    if (isNaN(hours) || isNaN(minutes)) {
        throw new Error("Invalid string format")
    }

    return fromDays(days)
        + fromHours(hours)
        + fromMinutes(minutes)
}

export function parseUpTimeAndLoadAverage(line: string): UpTimeAndLoadAverage {
    const matcher = /top - ([\d:]+) up (.+(?=,\s+\d \buser)),\s+(\d) \buser[s]?,\s+load average:(\s[\d.]+),(\s[\d.]+),(\s[\d.]+,?)/gm
    const tokens = Array.from(line.matchAll(matcher)).flat()

    if (tokens.length === 0) {
        throw new Error(`Invalid string format (${line})`)
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

export function parseTaskStates(str: string): TaskStates {
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

export function parseCpuStates(line: string): CpuStates {
    const matcher = /((\d+.\d+)\s+([^,]+))/gm
    const tokens = Array.from(line.matchAll(matcher))

    if (tokens.length === 0) {
        throw new Error("Invalid string format")
    }

    // @ts-expect-error The rationale for this is to try different method of parsing the code
    return Object.fromEntries(tokens
        .map(([, , value, key]) => [key, Number(value)]))
}

export function parsePhysicalMemory(input: string): PhysicalMemory {
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

export function parseVirtualMemory(input: string): VirtualMemory {
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

export function parseSummaryDisplay(lines: string[]): SummaryDisplay {
    return {
        upTimeAndLoadAverage: parseUpTimeAndLoadAverage(lines[0]),
        taskStates: parseTaskStates(lines[1]),
        cpuStates: parseCpuStates(lines[2]),
        physicalMemory: parsePhysicalMemory(lines[3]),
        virtualMemory: parseVirtualMemory(lines[4]),
    }
}

export function parseColumnsHeader(line: string): ColumnsHeader[] {
    const matcher = /(?:(?<=[^\s])\s(?=[^\s])[^\s]+\s+(?=\s)|(\s+[^\s]+))/gm
    const tokens = line.match(matcher)

    if (!tokens) {
        throw new Error("unkown input string")
    }

    return tokens
        .reduce((acc: ColumnsHeader[], token: string, i) => {
            const raw = token
            const title = raw.trim()
            const start = (acc[i - 1] ?? { end: 0 }).end
            const end = start + token.length

            return acc.push({
                raw,
                title,
                start,
                end
            }), acc
        }, [])
}

export function parseFieldsValues(input: FieldAndColumnsDisplayType): FieldsValues[] {
    const header = parseColumnsHeader(input.header)

    return input.fields
        .filter(line => line.length > 0)
        .map(line => {
            return Object.fromEntries(
                header.map(h => {
                    const key = h.title
                    const value = line.slice(h.start, h.end).trim()

                    return [ key, value ]
                })
            )
        })
}

const SUMMARY_DISPLAY_LINE_COUNT = 5

export function convertIntoTopInfoDisplayType(input: string): TopInfoDisplayType {
    const lines = input.split("\n")

    return {
        summary: lines.slice(0, SUMMARY_DISPLAY_LINE_COUNT),
        fieldAndColumns: {
            header: lines.slice(SUMMARY_DISPLAY_LINE_COUNT + 1).shift() || "",
            fields: lines.slice(SUMMARY_DISPLAY_LINE_COUNT + 2)
        }
    }
}

export function parseTopInfoBlock(input: string): TopInfo {
    const topInfoDisplayType = convertIntoTopInfoDisplayType(input)

    return {
        summaryDisplay: parseSummaryDisplay(topInfoDisplayType.summary),
        fieldValues: parseFieldsValues(topInfoDisplayType.fieldAndColumns)
    }
}

export function splitTopInfoToMultipleBlocks(input: string): string[] {
    const matcher = /^(top)(.*(?:\n(?!top).*)*)/gm
    return input.match(matcher) || []
}

/**
 * Will parse the output of top linux command into an object
 * @param {string} input - the text block that contains the top output
 * @throws Will throw an error if the input is invalid format
 * @returns An object that contains all the top information
 */
export function parseTopInfo(input: string): TopInfo[] {
    return splitTopInfoToMultipleBlocks(input)
        .map(parseTopInfoBlock)
}
