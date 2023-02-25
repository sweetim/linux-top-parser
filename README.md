## Linux TOP Parser

This package will parse the output from the linux `top` command


### Usage

```js
const { parseTopInfo } = require("linux-top-parser");

const topInfo = parseTopInfo(TOP_INFO_STRING);
```


### Example

There are 2 examples on how to use this package
- read from file
- stream from the linux `top` command output

Reference
- https://man7.org/linux/man-pages/man1/top.1.html