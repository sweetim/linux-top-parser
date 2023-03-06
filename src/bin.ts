#!/usr/bin/env node

import { resolve } from "path"
import { readFileSync } from "fs"

import chalk from 'chalk'
import { Command } from "commander"
import { PackageJson } from "type-fest"

import { topInfoTransform } from "."

const HELPER_TEXT = `

Example usage:
i) pipe output from ${chalk.bold("top")}

    ${chalk.yellow("top -b | linux-top-parser")}

ii) pipe output to ${chalk.bold("jq")}

    ${chalk.yellow(`top -b | linux-top-parser | jq`)}
`

const packageJson: PackageJson = JSON.parse(
    readFileSync(resolve(__dirname, "..", "package.json"))
    .toString())

const program = new Command()

program
    .name("linux-top-parser")
    .version(packageJson.version || "")
    .description("parser for linux top command")
    .addHelpText("after", HELPER_TEXT)
    .option("-t, --timeOut_ms <TIMEOUT_MS>", "specify the timeout value to emit the buffer", "100")
    .option("-s, --summary", "output summary display only", false)
    .option("-p, --prettify", "output top info with indentation and color", false)
    .option("-f, --filter", "output process that has > 0% of CPU usage only", false)
    .parse(process.argv)

type CLIOptions = {
    prettify: boolean
    summary: boolean
    filter: boolean
    timeOut_ms: number
}

const { prettify, summary, filter, timeOut_ms } = program.opts<CLIOptions>()
console.log(program.opts())
process.stdin
    .pipe(topInfoTransform({
        stringify: {
            prettify
        },
        summary,
        filter,
        timeOut_ms: Number(timeOut_ms)
    }))
    .on("data", console.log)
