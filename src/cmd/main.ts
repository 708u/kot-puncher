import {SLACK_WEBHOOK_URL} from '@/environment.ts'
import {parseArgs} from '@/lib/command.ts'
import {ExhaustiveError} from '@/lib/error.ts'
import {Notifier} from '@/lib/kot/notification/notifier.ts'
import {slackNotifier} from '@/lib/kot/notification/slack.ts'
import {run} from '@/lib/kot/scenario.ts'
import {parse} from 'https://deno.land/std@0.163.0/flags/mod.ts'

const option = parseArgs(parse(Deno.args))
if (option.dryRun) console.log('dry run enabled')

try {
  const result = await run(option)
  switch (result.type) {
    case 'success':
      if (option.sendNotificationEnabled) new Notifier(slackNotifier(SLACK_WEBHOOK_URL, option)).notify(result)
      break
    case `canceled`:
      console.log(`${option.mode} canceled. ${result.msg}`)
      break
    case `failed`:
      console.error(`${option.mode} failed. ${result.msg}`)
      break
    default:
      throw new ExhaustiveError(result.type)
  }
} catch (e) {
  console.error(`${option.mode} failed unexpectedly. ${e}`)
  Deno.exit(1)
}

console.log(`success ${option.mode}`)
