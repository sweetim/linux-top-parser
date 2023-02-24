import { describe, expect, it } from "vitest"
import { readFileSync } from "fs"
import { resolve } from "path"

import { parseTopInfo, TopInfo } from "../src"
import { parse } from "date-fns"

const SINGLE_DATA_FILE_NAME = "single.txt"
const MULTI_DATA_FILE_NAME = "multi.txt"

function getDataFilePath(fileName: string): string {
    const DATA_FOLDER_NAME = "data"
    return resolve(__dirname, DATA_FOLDER_NAME, fileName)
}

describe("parseTopInfo", () => {
    it("should be able to parse top output from single block", () => {
        const input = readFileSync(getDataFilePath(SINGLE_DATA_FILE_NAME)).toString()

        const expected: TopInfo[] = [
            {
                summaryDisplay: {
                    upTimeAndLoadAverage: {
                        time: parse("15:29:37", "HH:mm:ss", new Date()),
                        upTime_s: 57240,
                        totalNumberOfUsers: 0,
                        loadAverageLast_1_min: 0.14,
                        loadAverageLast_5_min: 0.07,
                        loadAverageLast_15_min: 0.06
                    },
                    taskStates: {
                        total: 60,
                        running: 1,
                        sleeping: 39,
                        stopped: 0,
                        zombie: 20
                    },
                    cpuStates: {
                        us: 0.4,
                        sy: 0.8,
                        ni: 0,
                        id: 98.4,
                        wa: 0,
                        hi: 0,
                        si: 0.4,
                        st: 0
                    },
                    physicalMemory: {
                        total: 7947.3,
                        free: 408.6,
                        used: 4257.3,
                        buffOrCache: 3281.4
                    },
                    virtualMemory: {
                        total: 2048,
                        free: 2048,
                        used: 0,
                        available: 3392.8
                    }
                },
                fieldValues: [
                    {
                        PID: "8253",
                        USER: "tim",
                        PR: "20",
                        NI: "0",
                        VIRT: "23.8g",
                        RES: "235884",
                        SHR: "37740",
                        S: "S",
                        "%CPU": "6.7",
                        "%MEM": "2.9",
                        "TIME+": "0:03.07",
                        COMMAND: "/home/tim/.nvm/versions/node/v18.12.0/bin/node --experimental-loader=file:///home/tim/.vscode-server/extensions/wallabyjs.wallaby-vscode-1.0.349/wallaby65f4bb/runners/node/hooks.mjs /home/tim/.vscode-server/extensions/wallabyjs.wallaby-vscode-1.0.349/wallaby65f4bb/server.js runner 0 40475 vitest@0.14.0,autoDetected  /home/tim/learn/linux-top-parser/node_modules /home/tim/.vscode-server/extensions/wallabyjs.wallaby-vscode-1.0.349/proje+",
                        P: "2"
                    },
                    {
                        PID: "1",
                        USER: "root",
                        PR: "20",
                        NI: "0",
                        VIRT: "1804",
                        RES: "1192",
                        SHR: "1104",
                        S: "S",
                        "%CPU": "0.0",
                        "%MEM": "0.0",
                        "TIME+": "0:00.02",
                        COMMAND: "/init",
                        P: "0"
                    },
                    {
                        PID: "137",
                        USER: "root",
                        PR: "20",
                        NI: "0",
                        VIRT: "731772",
                        RES: "23544",
                        SHR: "13128",
                        S: "S",
                        "%CPU": "0.0",
                        "%MEM": "0.3",
                        "TIME+": "0:01.18",
                        COMMAND: "/mnt/wsl/docker-desktop/docker-desktop-user-distro proxy --distro-name Ubuntu-20.04 --docker-desktop-root /mnt/wsl/docker-desktop --show-kube-system-containers=true",
                        P: "7"
                    },
                    {
                        PID: "1111",
                        USER: "tim",
                        PR: "20",
                        NI: "0",
                        VIRT: "2612",
                        RES: "592",
                        SHR: "524",
                        S: "S",
                        "%CPU": "0.0",
                        "%MEM": "0.0",
                        "TIME+": "0:00.01",
                        COMMAND: "sh -c \"$VSCODE_WSL_EXT_LOCATION/scripts/wslServer.sh\" 441438abd1ac652551dbe4d408dfcec8a499b8bf stable code-server .vscode-server --host=127.0.0.1 --port=0 --connection-token=1875702107-1805014795-764146776-1050828467 --use-host-proxy --without-browser-env-var --disable-websocket-compression --accept-server-license-terms --telemetry-level=all",
                        P: "12"
                    },
                    {
                        PID: "1178",
                        USER: "root",
                        PR: "20",
                        NI: "0",
                        VIRT: "1824",
                        RES: "104",
                        SHR: "0",
                        S: "S",
                        "%CPU": "0.0",
                        "%MEM": "0.0",
                        "TIME+": "0:00.74",
                        COMMAND: "/init",
                        P: "1"
                    },
                    {
                        PID: "1353",
                        USER: "tim",
                        PR: "20",
                        NI: "0",
                        VIRT: "1032408",
                        RES: "61188",
                        SHR: "31896",
                        S: "S",
                        "%CPU": "0.0",
                        "%MEM": "0.8",
                        "TIME+": "0:04.06",
                        COMMAND: "/home/tim/.vscode-server/bin/441438abd1ac652551dbe4d408dfcec8a499b8bf/node /home/tim/.vscode-server/bin/441438abd1ac652551dbe4d408dfcec8a499b8bf/out/bootstrap-fork --type=fileWatcher",
                        P: "4"
                    }
                ]
            }
        ]

        expect(parseTopInfo(input)).toStrictEqual(expected)
    })

    it("should be able to parse top output from multiple blocks", () => {
        const input = readFileSync(getDataFilePath(MULTI_DATA_FILE_NAME)).toString()

        const expected: TopInfo[] = [
            {
                summaryDisplay: {
                    upTimeAndLoadAverage: {
                        time: parse("15:29:37", "HH:mm:ss", new Date()),
                        upTime_s: 57240,
                        totalNumberOfUsers: 0,
                        loadAverageLast_1_min: 0.14,
                        loadAverageLast_5_min: 0.07,
                        loadAverageLast_15_min: 0.06
                    },
                    taskStates: {
                        total: 60,
                        running: 1,
                        sleeping: 39,
                        stopped: 0,
                        zombie: 20
                    },
                    cpuStates: {
                        us: 0.4,
                        sy: 0.8,
                        ni: 0,
                        id: 98.4,
                        wa: 0,
                        hi: 0,
                        si: 0.4,
                        st: 0
                    },
                    physicalMemory: {
                        total: 7947.3,
                        free: 408.6,
                        used: 4257.3,
                        buffOrCache: 3281.4
                    },
                    virtualMemory: {
                        total: 2048,
                        free: 2048,
                        used: 0,
                        available: 3392.8
                    }
                },
                fieldValues: [
                    {
                        PID: "8253",
                        USER: "tim",
                        PR: "20",
                        NI: "0",
                        VIRT: "23.8g",
                        RES: "235884",
                        SHR: "37740",
                        S: "S",
                        "%CPU": "6.7",
                        "%MEM": "2.9",
                        "TIME+": "0:03.07",
                        COMMAND: "/home/tim/.nvm/versions/node/v18.12.0/bin/node --experimental-loader=file:///home/tim/.vscode-server/extensions/wallabyjs.wallaby-vscode-1.0.349/wallaby65f4bb/runners/node/hooks.mjs /home/tim/.vscode-server/extensions/wallabyjs.wallaby-vscode-1.0.349/wallaby65f4bb/server.js runner 0 40475 vitest@0.14.0,autoDetected  /home/tim/learn/linux-top-parser/node_modules /home/tim/.vscode-server/extensions/wallabyjs.wallaby-vscode-1.0.349/proje+",
                        P: "2"
                    },
                    {
                        PID: "1",
                        USER: "root",
                        PR: "20",
                        NI: "0",
                        VIRT: "1804",
                        RES: "1192",
                        SHR: "1104",
                        S: "S",
                        "%CPU": "0.0",
                        "%MEM": "0.0",
                        "TIME+": "0:00.02",
                        COMMAND: "/init",
                        P: "0"
                    },
                    {
                        PID: "137",
                        USER: "root",
                        PR: "20",
                        NI: "0",
                        VIRT: "731772",
                        RES: "23544",
                        SHR: "13128",
                        S: "S",
                        "%CPU": "0.0",
                        "%MEM": "0.3",
                        "TIME+": "0:01.18",
                        COMMAND: "/mnt/wsl/docker-desktop/docker-desktop-user-distro proxy --distro-name Ubuntu-20.04 --docker-desktop-root /mnt/wsl/docker-desktop --show-kube-system-containers=true",
                        P: "7"
                    },
                    {
                        PID: "1111",
                        USER: "tim",
                        PR: "20",
                        NI: "0",
                        VIRT: "2612",
                        RES: "592",
                        SHR: "524",
                        S: "S",
                        "%CPU": "0.0",
                        "%MEM": "0.0",
                        "TIME+": "0:00.01",
                        COMMAND: "sh -c \"$VSCODE_WSL_EXT_LOCATION/scripts/wslServer.sh\" 441438abd1ac652551dbe4d408dfcec8a499b8bf stable code-server .vscode-server --host=127.0.0.1 --port=0 --connection-token=1875702107-1805014795-764146776-1050828467 --use-host-proxy --without-browser-env-var --disable-websocket-compression --accept-server-license-terms --telemetry-level=all",
                        P: "12"
                    },
                    {
                        PID: "1178",
                        USER: "root",
                        PR: "20",
                        NI: "0",
                        VIRT: "1824",
                        RES: "104",
                        SHR: "0",
                        S: "S",
                        "%CPU": "0.0",
                        "%MEM": "0.0",
                        "TIME+": "0:00.74",
                        COMMAND: "/init",
                        P: "1"
                    },
                    {
                        PID: "1353",
                        USER: "tim",
                        PR: "20",
                        NI: "0",
                        VIRT: "1032408",
                        RES: "61188",
                        SHR: "31896",
                        S: "S",
                        "%CPU": "0.0",
                        "%MEM": "0.8",
                        "TIME+": "0:04.06",
                        COMMAND: "/home/tim/.vscode-server/bin/441438abd1ac652551dbe4d408dfcec8a499b8bf/node /home/tim/.vscode-server/bin/441438abd1ac652551dbe4d408dfcec8a499b8bf/out/bootstrap-fork --type=fileWatcher",
                        P: "4"
                    },
                    {
                        PID: "",
                        USER: "",
                        PR: "",
                        NI: "",
                        VIRT: "",
                        RES: "",
                        SHR: "",
                        S: "",
                        "%CPU": "",
                        "%MEM": "",
                        "TIME+": "",
                        COMMAND: "",
                        P: ""
                    }
                ]
            },
            {
                summaryDisplay: {
                    upTimeAndLoadAverage: {
                        time: parse("15:29:38", "HH:mm:ss", new Date()),
                        upTime_s: 57240,
                        totalNumberOfUsers: 0,
                        loadAverageLast_1_min: 0.14,
                        loadAverageLast_5_min: 0.07,
                        loadAverageLast_15_min: 0.06
                    },
                    taskStates: {
                        total: 60,
                        running: 1,
                        sleeping: 39,
                        stopped: 0,
                        zombie: 20
                    },
                    cpuStates: {
                        us: 0.4,
                        sy: 0.8,
                        ni: 0.1,
                        id: 98.4,
                        wa: 0.2,
                        hi: 0.3,
                        si: 0.4,
                        st: 0
                    },
                    physicalMemory: {
                        total: 7947.3,
                        free: 408.6,
                        used: 4257.3,
                        buffOrCache: 3281.4
                    },
                    virtualMemory: {
                        total: 2048,
                        free: 2048,
                        used: 0,
                        available: 3392.8
                    }
                },
                fieldValues: [
                    {
                        PID: "8253",
                        USER: "tim",
                        PR: "20",
                        NI: "0",
                        VIRT: "23.8g",
                        RES: "235884",
                        SHR: "37740",
                        S: "S",
                        "%CPU": "6.7",
                        "%MEM": "3.9",
                        "TIME+": "0:03.07",
                        COMMAND: "/home/tim/.nvm/versions/node/v18.12.0/bin/node --experimental-loader=file:///home/tim/.vscode-server/extensions/wallabyjs.wallaby-vscode-1.0.349/wallaby65f4bb/runners/node/hooks.mjs /home/tim/.vscode-server/extensions/wallabyjs.wallaby-vscode-1.0.349/wallaby65f4bb/server.js runner 0 40475 vitest@0.14.0,autoDetected  /home/tim/learn/linux-top-parser/node_modules /home/tim/.vscode-server/extensions/wallabyjs.wallaby-vscode-1.0.349/proje+",
                        P: "2"
                    },
                    {
                        PID: "1",
                        USER: "root",
                        PR: "20",
                        NI: "0",
                        VIRT: "1804",
                        RES: "1192",
                        SHR: "1104",
                        S: "S",
                        "%CPU": "0.0",
                        "%MEM": "0.0",
                        "TIME+": "0:00.02",
                        COMMAND: "/init",
                        P: "0"
                    },
                    {
                        PID: "137",
                        USER: "root",
                        PR: "20",
                        NI: "0",
                        VIRT: "731772",
                        RES: "23544",
                        SHR: "13128",
                        S: "S",
                        "%CPU": "0.0",
                        "%MEM": "0.3",
                        "TIME+": "0:01.18",
                        COMMAND: "/mnt/wsl/docker-desktop/docker-desktop-user-distro proxy --distro-name Ubuntu-20.04 --docker-desktop-root /mnt/wsl/docker-desktop --show-kube-system-containers=true",
                        P: "7"
                    },
                    {
                        PID: "1111",
                        USER: "tim",
                        PR: "20",
                        NI: "0",
                        VIRT: "2612",
                        RES: "592",
                        SHR: "524",
                        S: "S",
                        "%CPU": "0.0",
                        "%MEM": "0.1",
                        "TIME+": "0:00.01",
                        COMMAND: "sh -c \"$VSCODE_WSL_EXT_LOCATION/scripts/wslServer.sh\" 441438abd1ac652551dbe4d408dfcec8a499b8bf stable code-server .vscode-server --host=127.0.0.1 --port=0 --connection-token=1875702107-1805014795-764146776-1050828467 --use-host-proxy --without-browser-env-var --disable-websocket-compression --accept-server-license-terms --telemetry-level=all",
                        P: "12"
                    },
                    {
                        PID: "1178",
                        USER: "root",
                        PR: "20",
                        NI: "0",
                        VIRT: "1824",
                        RES: "104",
                        SHR: "0",
                        S: "S",
                        "%CPU": "0.0",
                        "%MEM": "0.0",
                        "TIME+": "0:00.74",
                        COMMAND: "/init",
                        P: "1"
                    },
                    {
                        PID: "1353",
                        USER: "tim",
                        PR: "20",
                        NI: "0",
                        VIRT: "1032408",
                        RES: "61188",
                        SHR: "31896",
                        S: "S",
                        "%CPU": "0.0",
                        "%MEM": "0.8",
                        "TIME+": "0:04.06",
                        COMMAND: "/home/tim/.vscode-server/bin/441438abd1ac652551dbe4d408dfcec8a499b8bf/node /home/tim/.vscode-server/bin/441438abd1ac652551dbe4d408dfcec8a499b8bf/out/bootstrap-fork --type=fileWatcher",
                        P: "4"
                    },
                    {
                        PID: "",
                        USER: "",
                        PR: "",
                        NI: "",
                        VIRT: "",
                        RES: "",
                        SHR: "",
                        S: "",
                        "%CPU": "",
                        "%MEM": "",
                        "TIME+": "",
                        COMMAND: "",
                        P: ""
                    }
                ]
            }
        ]

        expect(parseTopInfo(input)).toStrictEqual(expected)
    })

    it("should throw error on empty input", () => {
        const input = ""

        expect(() => parseTopInfo(input)).toThrowError()
    })
})