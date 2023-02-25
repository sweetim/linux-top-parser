import { resolve } from "path"
import { readFileSync } from "fs"
import { parseTopInfo } from "../src"

const TOP_FILE_PATH = resolve(__dirname, "..", "test", "data", "multi.txt")

const input = readFileSync(TOP_FILE_PATH).toString()
const topInfo = parseTopInfo(input)

console.log(topInfo)
