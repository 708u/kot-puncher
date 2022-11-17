import {SLACK_WEBHOOK_URL} from '@/environment.ts'
import {resolve} from 'https://deno.land/std@0.162.0/path/mod.ts'
import {parse} from 'https://deno.land/std@0.163.0/flags/mod.ts'

type Mode = typeof modes[number]
export type Option = {
  mode: Mode
  dryRun: boolean
  verbose: boolean
  outDirBase: string
  sendNotificationEnabled: boolean
}

const modes = ['punch-in', 'punch-out'] as const

const isMode = (mode: unknown): mode is Mode => {
  return typeof mode === 'string' && modes.includes(mode as Mode)
}

export const parseArgs = (args: ReturnType<typeof parse>): Option => {
  if (!isMode(args.mode)) throw new Error(`${args.mode} is invalid mode. mode must be ${modes.join(', ')}`)

  const option = {
    mode: args.mode,
    dryRun: !!args?.['dry-run'],
    verbose: !!args?.v || !!args?.verbose,
    outDirBase: args?.o ? resolve(args?.o) : './out',
    sendNotificationEnabled: !!args?.['send-notification'],
  }

  if (option.sendNotificationEnabled && SLACK_WEBHOOK_URL === '')
    throw new Error(`env var $SLACK_WEBHOOK_URL must be set if send-notification is enabled`)

  return option
}
