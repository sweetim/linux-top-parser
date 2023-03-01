# Linux TOP Parser

[![npm][npm-shield]][npm-url]
[![GitHub Workflow Status][github-workflow-shield]][github-workflow-url]
[![Security Rating][security-shield]][security-url]
[![Reliability Rating][reliability-shield]][reliability-url]
[![Foresight Docs][foresight-shield]][foresight-url]
[![Coverage][coverage-shield]][coverage-url]

This package will parse the output from the linux `top` command into JSON object

It supports any number of columns and fields

## Usage

there are 2 ways to use this package
- CLI
- API


### CLI

the CLI can be pipe from the output of `top` command

```
top -b | npx linux-top-parser
```
or you can use the JSON processor CLI ( [jq](https://github.com/stedolan/jq) ) to process the stream

```
top -b | npx linux-top-parser | jq ".[0].summaryDisplay"
```


### API

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
    .pipe(topInfoTransform(true))
    .pipe(process.stdout)
```

### Examples

There are 2 code examples shown in the [example](https://github.com/sweetim/linux-top-parser/tree/master/example) folder on how to use this package
- [read from file](https://github.com/sweetim/linux-top-parser/blob/master/example/read-from-file.ts)
- [stream from the linux `top` command output](https://github.com/sweetim/linux-top-parser/blob/master/example/stream-from-top-command.ts)


### Reference
- https://man7.org/linux/man-pages/man1/top.1.html


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[npm-shield]: https://img.shields.io/npm/v/linux-top-parser?label=linux-top-parser
[npm-url]: https://www.npmjs.com/package/linux-top-parser
[github-workflow-shield]: https://img.shields.io/github/actions/workflow/status/sweetim/linux-top-parser/build-and-test.yml
[github-workflow-url]: https://github.com/sweetim/linux-top-parser/actions/workflows/build-and-test.yml
[security-shield]: https://sonarcloud.io/api/project_badges/measure?project=sweetim_linux-top-parser&metric=security_rating
[security-url]: https://sonarcloud.io/summary/new_code?id=sweetim_linux-top-parser
[reliability-shield]: https://sonarcloud.io/api/project_badges/measure?project=sweetim_linux-top-parser&metric=reliability_rating
[reliability-url]: https://sonarcloud.io/summary/new_code?id=sweetim_linux-top-parser
[foresight-shield]: https://api-public.service.runforesight.com/api/v1/badge/test?repoId=2f6249b7-0e9f-4e61-b1cd-64f9eb6c2fd9
[foresight-url]: https://docs.runforesight.com/
[coverage-shield]: https://sonarcloud.io/api/project_badges/measure?project=sweetim_linux-top-parser&metric=coverage
[coverage-url]: https://sonarcloud.io/summary/new_code?id=sweetim_linux-top-parser
