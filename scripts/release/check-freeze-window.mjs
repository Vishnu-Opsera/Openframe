import { existsSync, readFileSync } from 'node:fs'

export function checkFreezeWindow({ today, calendar, exceptionPath }) {
  const blocked = calendar.windows.some((window) => today >= window.start && today <= window.end)
  if (!blocked) {
    return { allowed: true, reason: 'outside_freeze' }
  }
  if (exceptionPath && existsSync(exceptionPath)) {
    const exception = JSON.parse(readFileSync(exceptionPath, 'utf8'))
    if (exception.id && exception.approver && exception.reason) {
      return { allowed: true, reason: 'approved_exception', exceptionId: exception.id }
    }
  }
  return {
    allowed: false,
    reason: 'freeze_window',
    required: ['id', 'approver', 'reason'],
  }
}

const isDirectRun = process.argv[1]?.endsWith('check-freeze-window.mjs')
if (isDirectRun) {
  const calendar = JSON.parse(readFileSync(process.argv[2] ?? 'tests/fixtures/release/freeze-calendar.json', 'utf8'))
  const result = checkFreezeWindow({
    today: process.env.OPENFRAME_RELEASE_DATE || '2026-06-01',
    calendar,
    exceptionPath: process.argv[3],
  })
  if (!result.allowed) {
    console.error(JSON.stringify(result))
    process.exit(1)
  }
  console.log(JSON.stringify(result))
}
