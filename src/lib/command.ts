import {ENV} from '@/environment.ts'
import {format} from 'date-fns'
import {mkdirSync} from 'node:fs'
import {join, resolve} from 'node:path'
import {parseArgs as parseCommandArgs} from 'node:util'

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

export const parseArgs = (argv: string[] = process.argv.slice(2)): Readonly<Option> => {
  const {values: args} = parseCommandArgs({
    args: argv,
    options: {
      mode: {type: 'string'},
      o: {type: 'string'},
      verbose: {type: 'boolean', short: 'v'},
      force: {type: 'boolean', short: 'f'},
      'dry-run': {type: 'boolean'},
      'send-notification': {type: 'boolean'},
    },
  })
  if (!isMode(args.mode)) throw new Error(`${args.mode} is invalid mode. mode must be ${modes.join(', ')}`)

  const outDirBase = args?.o ? resolve(args?.o) : './out'
  const targetDate = new Date()
  const screenShotDir = join(outDirBase, 'screenshot', `${format(targetDate, 'yyyyMMdd')}-${args.mode}`)
  mkdirSync(screenShotDir, {recursive: true})

  const option = {
    mode: args.mode,
    dryRun: !!args?.['dry-run'],
    verbose: !!args.verbose,
    outDirBase,
    screenShotDir,
    targetDate,
    force: !!args.force,
    sendNotificationEnabled: !!args?.['send-notification'],
  } as const satisfies Option

  if (option.sendNotificationEnabled && ENV.SLACK_WEBHOOK_URL === '')
    throw new Error(`env var $SLACK_WEBHOOK_URL must be set if send-notification is enabled`)

  return option
}
