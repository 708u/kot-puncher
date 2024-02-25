import {ENV} from '@/environment.ts'
import {parseArgs} from '@/lib/command.ts'
import {ExhaustiveError} from '@/lib/error.ts'
import {Notifier} from '@/lib/kot/notification/notifier.ts'
import {slackNotifier} from '@/lib/kot/notification/slack.ts'
import {kotPuncherPunchInScenarioRunner, runScenario} from '@/lib/kot/runner.ts'
import {retryAsync} from '@/lib/retry.ts'
import {parse} from 'std/flag'

const option = parseArgs(parse(Deno.args))
if (option.verbose) console.log(option)
if (option.dryRun) console.log('dry run enabled')

try {
  const result = await retryAsync(() => runScenario(kotPuncherPunchInScenarioRunner(option), option))

  switch (result.type) {
    case 'success':
      if (option.sendNotificationEnabled) {
        if (option.dryRun) {
          console.log('notification sent. dry run enabled.')
        } else {
          await new Notifier(slackNotifier(ENV.SLACK_WEBHOOK_URL, option)).notify(result)
        }
      }
      console.log(`run ${option.mode} success.`)
      break
    case 'canceled':
      console.log(`run ${option.mode} canceled. ${result.msg}`)
      break
    case 'failed':
      console.error(`run ${option.mode} failed. ${result.msg}`)
      break
    default:
      throw new ExhaustiveError(result.type)
  }
} catch (e) {
  console.error(`${option.mode} failed unexpectedly. ${e}`)
  Deno.exit(1)
}

Deno.exit(0)
