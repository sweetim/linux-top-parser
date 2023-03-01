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
    .option("-s, --summary", "output summary display only", false)
    .option("-p, --prettify", "output top info with indentation and color", false)
    .option("-f, --filter", "output process that has > 0% of CPU usage only", false)
    .parse(process.argv)

type CLIOptions = {
    prettify: boolean
    summary: boolean
    filter: boolean
}

const { prettify, summary, filter } = program.opts<CLIOptions>()

process.stdin
    .pipe(topInfoTransform({
        stringify: {
            prettify
        },
        summary,
        filter
    }))
    .pipe(process.stdout)
