import {Option} from '@/lib/command.ts'
import {ExhaustiveError} from '@/lib/error.ts'
import {NoticeCallback} from '@/lib/kot/notification/notifier.ts'
import {Result} from '@/lib/kot/scenario.ts'

export const slackNotifier = (webHookUrl: string, option: Option): NoticeCallback => {
  return async (result: Result) => {
    if (option.verbose) console.log('send message to slack')
    if (result.type !== 'success') {
      if (option.verbose) console.log(`send notification skipped. result type: ${result.type}`)
      return
    }

    if (!option.dryRun) {
      let msg = ''
      switch (option.mode) {
        case 'punch-in':
          msg = 'hi'
          break
        case 'punch-out':
          msg = 'bye'
          break
        default:
          throw new ExhaustiveError(option.mode)
      }

      // notify message to slack via webhook
      await fetch(webHookUrl, {method: 'POST', body: JSON.stringify({text: msg})})
    }

    if (option.verbose) console.log('send message to slack success')
  }
}
