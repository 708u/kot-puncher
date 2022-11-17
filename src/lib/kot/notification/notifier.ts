import {Result} from '@/lib/kot/scenario.ts'
export type NoticeCallback = (result: Result) => Promise<void>

export class Notifier {
  constructor(...notifiers: Array<NoticeCallback>) {
    this.notifiers = notifiers
  }

  private notifiers: Array<NoticeCallback>

  public notify(result: Result): void {
    this.notifiers.forEach(async notify => await notify(result))
  }
}
