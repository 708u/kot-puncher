import {resolve} from 'https://deno.land/std@0.162.0/path/mod.ts'
import {parse} from 'https://deno.land/std@0.163.0/flags/mod.ts'

export type Option = {
  verbose: boolean
  outDirBase: string
  sendNotificationEnabled: boolean
}

export const parseArgs = (args: ReturnType<typeof parse>): Option => {
  const option = {
    verbose: !!args?.v || !!args?.verbose,
    outDirBase: args?.o ? resolve(args?.o) : './out',
    sendNotificationEnabled: !!args?.['send-notification'],
  }

  return option
}
