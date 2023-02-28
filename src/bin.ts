#!/usr/bin/env node

import { resolve } from "path"
import { readFileSync } from "fs"

import { PackageJson } from "type-fest"
import { Command } from "commander"
import chalk from 'chalk'

import { topInfoTransform } from "."

const packageJson: PackageJson = JSON.parse(
    readFileSync(resolve(__dirname, "..", "package.json"))
    .toString())

const program = new Command()

const helperText = `

Example usage:
i) pipe output from ${chalk.bold("top")}

    ${chalk.yellow("top -b | linux-top-parser")}

ii) pipe output to ${chalk.bold("jq")}

    ${chalk.yellow(`top -b | linux-top-parser | jq`)}
`

program
    .name("linux-top-parser")
    .version(packageJson.version || "")
    .description("parser for linux top command")
    .addHelpText("after", helperText)
    .parse(process.argv)

process.stdin
    .pipe(topInfoTransform(true))
    .pipe(process.stdout)
