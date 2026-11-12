export const ENV = {
  KOT_URL: process.env.KOT_URL ?? '',
  KOT_USER_ID: process.env.KOT_USER_ID ?? '',
  KOT_USER_PASSWORD: process.env.KOT_USER_PASSWORD ?? '',
  SLACK_WEBHOOK_URL: process.env.KOT_PUNCHER_SLACK_WEBHOOK_URL ?? '',
  SLACK_PUNCH_IN_MESSAGES: process.env.SLACK_PUNCH_IN_MESSAGES ?? 'hi',
  SLACK_PUNCH_OUT_MESSAGES: process.env.SLACK_PUNCH_OUT_MESSAGES ?? 'bye',
  SLACK_REST_BEGIN_MESSAGES: process.env.SLACK_REST_BEGIN_MESSAGES ?? '休憩開始',
  SLACK_REST_END_MESSAGES: process.env.SLACK_REST_END_MESSAGES ?? '休憩終了',
} as const
