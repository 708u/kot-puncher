import {Option} from '@/lib/command.ts'
import {NoticeCallback} from '@/lib/kot/notification/notifier.ts'

export const slackNotifier = (webHookUrl: string, option: Option): NoticeCallback => {
  return async (text: string) => {
    if (option.verbose) console.log('send message to slack')
    if (!option.dryRun) await fetch(webHookUrl, {method: 'POST', body: JSON.stringify({text})})
  }
}
