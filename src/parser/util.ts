export function fromDays(days: number): number {
    return fromHours(days * 24)
}

export function fromHours(hours: number): number {
    return fromMinutes(hours * 60)
}

export function fromMinutes(minutes: number): number {
    return minutes * 60
}
