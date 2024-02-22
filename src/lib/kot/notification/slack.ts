import {ENV} from '@/environment.ts'
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
      // notify message to slack via webhook
      await fetch(webHookUrl, {method: 'POST', body: JSON.stringify({text: getSlackMessage(option)})})
    }

    if (option.verbose) console.log('send message to slack success')
  }
}

export const getSlackMessage = (option: Option): string => {
  switch (option.mode) {
    case 'punch-in':
      return getSomeMessage(ENV.SLACK_PUNCH_IN_MESSAGES.split(','), 'hi')
    case 'punch-out':
      return getSomeMessage(ENV.SLACK_PUNCH_OUT_MESSAGES.split(','), 'bye')
    case 'rest-begin':
      return getSomeMessage(ENV.SLACK_REST_BEGIN_MESSAGES.split(','), '休憩')
    case 'rest-end':
      return getSomeMessage(ENV.SLACK_REST_END_MESSAGES.split(','), '休憩終了')
    default:
      throw new ExhaustiveError(option.mode)
  }
}

const getSomeMessage = <T>(arr: Array<T>, fallback: T): T => {
  if (arr.length === 0) return fallback
  if (arr.length === 1) return arr[0]
  const randomIndex = Math.floor(Math.random() * arr.length)
  return arr[randomIndex]
}
