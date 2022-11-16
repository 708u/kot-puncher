export type NoticeCallback = (msg: string) => Promise<void>

export class Notifier {
  constructor(...notifiers: Array<NoticeCallback>) {
    this.notifiers = notifiers
  }

  private notifiers: Array<NoticeCallback>

  public notify(msg: string): void {
    this.notifiers.forEach(async notify => await notify(msg))
  }
}
