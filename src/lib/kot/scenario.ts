type Status = 'success' | 'canceled' | 'failed'
export type Result = {
  type: Status
  msg: string
}
