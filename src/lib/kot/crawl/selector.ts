export const selector = {
  recorder: {
    clockIn: '#buttons > li > .record > .record-clock-in',
    clockOut: '#buttons > li > .record > .record-clock-out',
    recordList: '#buttons > li > .record',
    recordBtnClass: '.record-btn-inner',
    humbuggerMenu: {
      id: '#menu_icon',
      timeCard: '#menu > li:first-child > .text-middle',
    },
  },
  login: {
    submit:
      '#modal_window > .modal-content > .container > .btn-control-outer > .btn-control-inner > .btn-control-message',
  },
  timeCard: {
    tableRaw: '.htBlock-adjastableTableF > .htBlock-adjastableTableF_inner > table > tbody > tr',
    startAndEndDate: '.start_end_timerecord',
    rest: '.rest_timerecord',
  },
} as const

export const restButtonIndex = {
  begin: 2,
  end: 3,
} as const

export type RestButtonIndex = (typeof restButtonIndex)[keyof typeof restButtonIndex]

// parseDateFromTimeCardTableData parses data that depends on timecard table data format. e.g.  11/04 (月)
// const td = 11/04 (月)
// parseDateFromTimeCardTableData(td) // 11/04
export const parseDateFromTimeCardTableData = (str: string): string => {
  return str.match(/\d{1,}\/\d{1,}/)?.[0] || ''
}
