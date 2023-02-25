import { spawn } from "child_process"

import { topInfoTransform } from "../src/streams"

const top = spawn("top", ["-b", "-n", "10"]);

top.stderr.on("data", (data) => {
    console.log(data);
});

top.stdout
    .pipe(topInfoTransform())
    .on("data", console.log)
    // .pipe(process.stdout)