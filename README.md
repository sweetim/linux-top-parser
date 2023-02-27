## Linux TOP Parser

[![npm](https://img.shields.io/npm/v/linux-top-parser?label=linux-top-parser)](https://www.npmjs.com/package/linux-top-parser)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/sweetim/linux-top-parser/build-and-test.yml)](https://github.com/sweetim/linux-top-parser/actions/workflows/build-and-test.yml)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=sweetim_linux-top-parser&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=sweetim_linux-top-parser)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=sweetim_linux-top-parser&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=sweetim_linux-top-parser)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=sweetim_linux-top-parser&metric=coverage)](https://sonarcloud.io/summary/new_code?id=sweetim_linux-top-parser)

This package will parse the output from the linux `top` command into object

It supports any number of columns and fields

### Usage


```js
const { parseTopInfo, topInfoTransform } = require("linux-top-parser");

const topInfo = parseTopInfo(TOP_INFO_STRING);

// or using transform stream
createReadStream(TOP_FILE_PATH)
    .pipe(topInfoTransform(true))
    .pipe(process.stdout)

```

### Code Examples

There are 2 code examples shown in the [example](https://github.com/sweetim/linux-top-parser/tree/master/example) folder on how to use this package
- [read from file](https://github.com/sweetim/linux-top-parser/blob/master/example/read-from-file.ts)
- [stream from the linux `top` command output](https://github.com/sweetim/linux-top-parser/blob/master/example/stream-from-top-command.ts)

Reference
- https://man7.org/linux/man-pages/man1/top.1.html
