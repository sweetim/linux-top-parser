import { describe, it, expect } from "vitest"
import { fromDays } from "./util"

describe("fromDays", () => {
    it.each([
        {
            input: 1,
            expected: 86400
        },
        {
            input: 2,
            expected: 172800
        }
    ])("can convert to seconds from days ($input)", ({ input, expected }) => {
        expect(fromDays(input)).toBe(expected)
    })
})