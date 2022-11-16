import {NoticeCallback} from '@/lib/kot/notification/notifier.ts'

export const slackNotifier = (webHookUrl: string): NoticeCallback => {
  return async (msg: string) => {
    await fetch(webHookUrl, {method: 'POST', body: JSON.stringify(msg)})
  }
}
