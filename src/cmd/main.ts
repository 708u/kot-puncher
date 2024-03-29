import {ENV} from '@/environment.ts'
import {parseArgs} from '@/lib/command.ts'
import {ExhaustiveError} from '@/lib/error.ts'
import {Notifier} from '@/lib/kot/notification/notifier.ts'
import {slackNotifier} from '@/lib/kot/notification/slack.ts'
import {createKotPuncherScenarioRunnerByMode, runScenario} from '@/lib/kot/runner.ts'
import {retryAsync} from '@/lib/retry.ts'
import {parse} from 'std/flag'

const run = async (): Promise<0 | 1> => {
  const option = parseArgs(parse(Deno.args))
  if (option.verbose) console.log(option)
  if (option.dryRun) console.log('dry run enabled')

  try {
    const result = await retryAsync(() => runScenario(createKotPuncherScenarioRunnerByMode(option)))

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
        return 0
      case 'canceled':
        console.log(`run ${option.mode} canceled. ${result.msg}`)
        return 0
      case 'failed':
        console.error(`run ${option.mode} failed. ${result.msg}`)
        return 1
      default:
        throw new ExhaustiveError(result.type)
    }
  } catch (e) {
    console.error(`${option.mode} failed unexpectedly. ${e}`)
    return 1
  }
}

Deno.exit(await run())
