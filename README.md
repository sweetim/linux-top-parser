<div align="center">
  <h3 align="center">
    Linux TOP Parser <img src='https://static.npmjs.com/255a118f56f5346b97e56325a1217a16.svg' width='20'>
  </h3>

  <a href="https://www.npmjs.com/package/linux-top-parser">
    <img src="https://img.shields.io/npm/v/linux-top-parser?label=linux-top-parser">
  </a>
  <a href="https://github.com/sweetim/linux-top-parser/actions/workflows/build-and-test.yml">
    <img src="https://img.shields.io/github/actions/workflow/status/sweetim/linux-top-parser/build-and-test.yml">
  </a>
  <a href="https://sonarcloud.io/summary/new_code?id=sweetim_linux-top-parser">
    <img src="https://sonarcloud.io/api/project_badges/measure?project=sweetim_linux-top-parser&metric=security_rating">
  </a>
  <a href="https://sonarcloud.io/summary/new_code?id=sweetim_linux-top-parser">
    <img src="https://sonarcloud.io/api/project_badges/measure?project=sweetim_linux-top-parser&metric=reliability_rating">
  </a>
  <a href="https://app.runforesight.com/repositories/github/sweetim/linux-top-parser/pull-requests">
    <img src="https://api-public.service.runforesight.com/api/v1/badge/success?repoId=2f6249b7-0e9f-4e61-b1cd-64f9eb6c2fd9">
  </a>
  <a href="https://sonarcloud.io/summary/new_code?id=sweetim_linux-top-parser">
    <img src="https://sonarcloud.io/api/project_badges/measure?project=sweetim_linux-top-parser&metric=coverage">
  </a>

  </br>

  <p>this package will parse the output from the linux <strong>top</strong> command into JSON object</p>
  <p>it supports any number of columns and fields</p>
</div>

## Usage

there are 2 ways to use this package
-   API
-   CLI

## API

#### Installation

```
npm i linux-top-parser -S
```

#### Code

```js
const { parseTopInfo, topInfoTransform } = require("linux-top-parser");

// normal string parsing
const topInfo = parseTopInfo(TOP_INFO_STRING);

// or using transform stream
createReadStream(TOP_FILE_PATH)
    .pipe(topInfoTransform({
        stringify: true
    }))
    .pipe(process.stdout)
```

### Examples

There are 2 code examples shown in the [example](https://github.com/sweetim/linux-top-parser/tree/master/example) folder on how to use this package
-  [read from file](https://github.com/sweetim/linux-top-parser/blob/master/example/read-from-file.ts)
-  [stream from the linux `top` command output](https://github.com/sweetim/linux-top-parser/blob/master/example/stream-from-top-command.ts)

## CLI

the CLI can be pipe from the output of `top` command

```
top -b | npx linux-top-parser
```
or you can use the JSON processor CLI ( [jq](https://github.com/stedolan/jq) ) to process the stream

```
top -b | npx linux-top-parser | jq ".[0].summaryDisplay"
```
### Usage

```
linux-top-parser [options]

Options:
  -V, --version   output the version number
  -s, --summary   output summary display only (default: false)
  -p, --prettify  output top info with indentation and color (default: false)
  -f, --filter    output process that has > 0% of CPU usage only (default: false)
  -h, --help      display help for command
```

### Reference
-  https://man7.org/linux/man-pages/man1/top.1.html
