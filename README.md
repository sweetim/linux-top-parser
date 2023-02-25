## Linux TOP Parser

This package will parse the output from the linux `top` command


### Usage

```js
const { parseTopInfo } = require("linux-top-parser");

const topInfo = parseTopInfo(TOP_INFO_STRING);
```


### Code Examples

There are 2 code examples shown in the [example](https://github.com/sweetim/linux-top-parser/tree/master/example) folder on how to use this package
- [read from file](https://github.com/sweetim/linux-top-parser/blob/master/example/read-from-file.ts)
- [stream from the linux `top` command output](https://github.com/sweetim/linux-top-parser/blob/master/example/stream-from-top-command.ts)

Reference
- https://man7.org/linux/man-pages/man1/top.1.html