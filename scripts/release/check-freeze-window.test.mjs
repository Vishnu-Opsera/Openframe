import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { checkFreezeWindow } from './check-freeze-window.mjs'

const calendar = JSON.parse(readFileSync('tests/fixtures/release/freeze-calendar.json', 'utf8'))

describe('check freeze window', () => {
  it('blocks publication during the fixture freeze unless an exception file exists', () => {
    const blocked = checkFreezeWindow({ today: '2026-06-01', calendar, exceptionPath: undefined })
    expect(blocked.allowed).toBe(false)
    const allowed = checkFreezeWindow({
      today: '2026-06-01',
      calendar,
      exceptionPath: 'tests/fixtures/release/approved-exception.json',
    })
    expect(allowed.allowed).toBe(true)
    expect(allowed.exceptionId).toBe('EX-2026-001')
  })
})
