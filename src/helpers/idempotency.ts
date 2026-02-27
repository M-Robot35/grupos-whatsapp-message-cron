export function makeIdempotencyKey(input: {
  scheduleId: string
  groupId: string
  occurrenceIso: string
}): string {
  return `${input.scheduleId}:${input.groupId}:${input.occurrenceIso}`
}
