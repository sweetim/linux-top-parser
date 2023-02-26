## Linux TOP Parser
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=sweetim_linux-top-parser&metric=coverage)](https://sonarcloud.io/summary/new_code?id=sweetim_linux-top-parser)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=sweetim_linux-top-parser&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=sweetim_linux-top-parser)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=sweetim_linux-top-parser&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=sweetim_linux-top-parser)

This package will parse the output from the linux `top` command into object

It supports any number of columns and fields

### Usage


```js
const { parseTopInfo } = require("linux-top-parser");
const { topInfoTransform } = require("linux-top-parser/streams");

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