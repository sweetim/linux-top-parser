#!/usr/bin/env node

import { Command } from "commander"

import { topInfoTransform } from "."

const program = new Command()

const description = `stream top output and parse into JSON object
top -b | linux-top-parser
`

program
    .name("linux-top-parser")
    .description(description)
    .parse(process.argv)

process.stdin
    .pipe(topInfoTransform(true))
    .pipe(process.stdout)
