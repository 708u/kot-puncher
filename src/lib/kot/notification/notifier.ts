import {Result} from '@/lib/kot/scenario.ts'
export type NoticeCallback = (result: Result) => Promise<void>

export class Notifier {
  constructor(...notifiers: Array<NoticeCallback>) {
    this.notifiers = notifiers
  }

  private notifiers: Array<NoticeCallback>

  public async notify(result: Result): Promise<void> {
    await Promise.all(this.notifiers.map(notifier => notifier(result)))
  }
}
