import { spawn } from "child_process"

import { topInfoTransform } from "../src/streams"

const top = spawn("top", ["-bn 1"]);

// if want to output as object
top.stdout
    .pipe(topInfoTransform())
    .on("data", console.log)

// if want to output as string
top.stdout
    .pipe(topInfoTransform({
        stringify: true
    }))
    .pipe(process.stdout)
