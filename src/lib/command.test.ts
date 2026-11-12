import {afterAll, describe, expect, test} from 'bun:test'
import {mkdtempSync, rmSync, existsSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import {format} from 'date-fns'
import {parseArgs} from './command.ts'

const out = mkdtempSync(join(tmpdir(), 'kot-puncher-'))
afterAll(() => rmSync(out, {recursive: true, force: true}))

const modes = ['punch-in', 'punch-out', 'rest-begin', 'rest-end'] as const

describe('Bun command arguments', () => {
  for (const mode of modes) {
    test(mode, () => {
      const option = parseArgs(['--mode', mode, '-o', out, '--dry-run', '-v', '-f'])
      expect(option.mode).toBe(mode)
      expect(option.dryRun).toBe(true)
      expect(option.verbose).toBe(true)
      expect(option.force).toBe(true)
      expect(option.sendNotificationEnabled).toBe(false)
      expect(option.screenShotDir).toBe(join(out, 'screenshot', `${format(option.targetDate, 'yyyyMMdd')}-${mode}`))
      expect(existsSync(option.screenShotDir)).toBe(true)
    })
  }

  test('long options and boolean defaults', () => {
    const option = parseArgs(['--mode=punch-in', '-o', out, '--verbose', '--force'])
    expect(option.verbose).toBe(true)
    expect(option.force).toBe(true)
    expect(option.dryRun).toBe(false)
    const defaults = parseArgs(['--mode', 'punch-out', '-o', out])
    expect(defaults.verbose).toBe(false)
    expect(defaults.force).toBe(false)
  })

  test('rejects missing and invalid modes', () => {
    expect(() => parseArgs([])).toThrow('invalid mode')
    expect(() => parseArgs(['--mode', 'invalid'])).toThrow('invalid mode')
  })

  test('rejects missing option values', () => {
    expect(() => parseArgs(['--mode'])).toThrow()
    expect(() => parseArgs(['--mode', 'punch-in', '-o'])).toThrow()
  })
})

describe('Bun entrypoint', () => {
  for (const mode of modes) {
    test(`dry-run ${mode} without remote access`, () => {
      const result = Bun.spawnSync({
        cmd: [process.execPath, 'src/cmd/main.ts', '--mode', mode, '--dry-run', '-v', '-o', out, '--send-notification'],
        cwd: join(import.meta.dir, '../..'),
        env: {
          PATH: process.env.PATH,
          KOT_URL: 'http://127.0.0.1:1',
          KOT_PUNCHER_SLACK_WEBHOOK_URL: 'http://127.0.0.1:1/slack',
        },
      })
      expect(result.exitCode).toBe(0)
      expect(result.stdout.toString()).toContain(`run ${mode} success.`)
      expect(result.stdout.toString()).toContain('notification sent. dry run enabled.')
      expect(result.stderr.toString()).toBe('')
    })
  }
})
