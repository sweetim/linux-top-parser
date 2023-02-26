import { resolve } from "path"
import { readFileSync, createReadStream } from "fs"
import { parseTopInfo } from "../src"
import { topInfoTransform } from "../src/streams"

const TOP_FILE_PATH = resolve(__dirname, "..", "test", "data", "multi.txt")

const input = readFileSync(TOP_FILE_PATH).toString()
const topInfo = parseTopInfo(input)

console.log(topInfo)

createReadStream(TOP_FILE_PATH)
    .pipe(topInfoTransform(true))
    .pipe(process.stdout)
