export const selector = {
  recorder: {
    clockIn: '#buttons > li > .record > .record-clock-in',
    clockOut: '#buttons > li > .record > .record-clock-out',
    humbuggerMenu: {
      id: '#menu_icon',
      timeCard: '#menu > li:first-child > .text-middle',
    },
  },
  login: {
    submit:
      '#modal_window > .modal-content > .container > .btn-control-outer > .btn-control-inner > .btn-control-message',
  },
} as const
