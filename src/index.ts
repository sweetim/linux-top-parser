import { UsingRegex, TopInfo } from "./parser"

export { TopInfo } from "./parser/types"
export { topInfoTransform } from "./streams/top-info-transform"

/**
 * Parses top-level information from a string input.
 * @param {string} input - The string input to be parsed.
 * @returns {TopInfo[]} An array of TopInfo objects representing the parsed information.
 * @throws {Error} If the input string is empty.
 */
export function parseTopInfo(input: string): TopInfo[] {
    if (input.length === 0) {
        throw new Error("Empty string")
    }

    return UsingRegex.parseTopInfo(input)
}
