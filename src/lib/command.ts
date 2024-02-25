import {ENV} from '@/environment.ts'
import {format} from 'std/datetime'
import {parse} from 'std/flag'
import {ensureDir} from 'std/fs'
import {join, resolve} from 'std/path'

type Mode = (typeof modes)[number]
export type Option = {
  mode: Mode
  dryRun: boolean
  verbose: boolean
  force: boolean
  outDirBase: string
  screenShotDir: string
  targetDate: Date
  sendNotificationEnabled: boolean
}

const modes = ['punch-in', 'punch-out', 'rest-begin', 'rest-end'] as const

const isMode = (mode: unknown): mode is Mode => {
  return typeof mode === 'string' && modes.includes(mode as Mode)
}

export const parseArgs = (args: ReturnType<typeof parse>): Option => {
  if (!isMode(args.mode)) throw new Error(`${args.mode} is invalid mode. mode must be ${modes.join(', ')}`)

  const outDirBase = args?.o ? resolve(args?.o) : './out'
  const targetDate = new Date()
  const screenShotDir = join(outDirBase, 'screenshot', format(targetDate, `yyyyMMdd-${args.mode}`))
  ensureDir(screenShotDir)

  const option = {
    mode: args.mode,
    dryRun: !!args?.['dry-run'],
    verbose: !!args?.v || !!args?.verbose,
    outDirBase,
    screenShotDir,
    targetDate,
    force: !!args?.f || !!args?.force,
    sendNotificationEnabled: !!args?.['send-notification'],
  }

  if (option.sendNotificationEnabled && ENV.SLACK_WEBHOOK_URL === '')
    throw new Error(`env var $SLACK_WEBHOOK_URL must be set if send-notification is enabled`)

  return option
}
