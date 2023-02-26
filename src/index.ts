import { UsingRegex, TopInfo } from "./parser"

export { topInfoTransform } from "./streams/top-info-transform"
export { TopInfo } from "./parser/types"
/**
 * Will parse the output of top linux command into an object
 * @param {string} input - the text block that contains the top output
 * @throws Will throw an error if the input is invalid format
 * @returns An object that contains all the top information
 */
export function parseTopInfo(input: string): TopInfo[] {
    if (input.length === 0) {
        throw new Error("Empty string")
    }

    return UsingRegex.parseTopInfo(input)
}
