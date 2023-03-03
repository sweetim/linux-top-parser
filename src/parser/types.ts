export interface UpTimeAndLoadAverage {
    time: Date
    upTime_s: number
    totalNumberOfUsers: number
    loadAverageLast_1_min: number
    loadAverageLast_5_min: number
    loadAverageLast_15_min: number
}

export interface TaskStates {
    total: number
    running: number
    sleeping: number
    stopped: number
    zombie: number
}

export interface CpuStates {
    cpu: number,
    us: number
    sy: number
    ni: number
    id: number
    wa: number
    hi: number
    si: number
    st: number
}

export interface PhysicalMemory {
    total: number
    free: number
    used: number
    buffOrCache: number
}

export interface VirtualMemory {
    total: number
    free: number
    used: number
    available: number
}

export interface SummaryDisplay {
    upTimeAndLoadAverage: UpTimeAndLoadAverage
    taskStates: TaskStates
    cpuStates: CpuStates[]
    physicalMemory: PhysicalMemory
    virtualMemory: VirtualMemory
}

export interface ColumnsHeader {
    title: string,
    raw: string,
    start: number,
    end: number
}

const fields = [
    "PID",
    "ENVIRON",
    "USER",
    "vMj",
    "PR",
    "vMn",
    "NI",
    "USED",
    "VIRT",
    "nsIPC",
    "RES",
    "nsMNT",
    "SHR",
    "nsNET",
    "S",
    "nsPID",
    "%CPU",
    "nsUSER",
    "%MEM",
    "nsUTS",
    "TIME+",
    "LXC",
    "COMMAND",
    "RSan",
    "PPID",
    "RSfd",
    "UID",
    "RSlk",
    "RUID",
    "RSsh",
    "RUSER",
    "CGNAME",
    "SUID",
    "NU",
    "SUSER",
    "GID",
    "GROUP",
    "PGRP",
    "TTY",
    "TPGID",
    "SID",
    "nTH",
    "P",
    "TIME",
    "SWAP",
    "CODE",
    "DATA",
    "nMaj",
    "nMin",
    "nDRT",
    "WCHAN",
    "Flags",
    "CGROUPS",
    "SUPGIDS",
    "SUPGRPS",
    "TGID",
    "OOMa",
    "OOMs",
] as const

type Fields = typeof fields[number]

export type FieldsValues = Partial<Record<Fields, string>>

export interface TopInfoDisplayType {
    summary: string
    fieldAndColumns: FieldAndColumnsDisplayType
}

export interface FieldAndColumnsDisplayType {
    header: string,
    fields: string[]
}

export interface TopInfo {
    summaryDisplay: SummaryDisplay,
    fieldValues: FieldsValues[]
}
