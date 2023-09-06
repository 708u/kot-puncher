export const ENV = {
  KOT_URL: Deno.env.get('KOT_URL') ?? '',
  KOT_USER_ID: Deno.env.get('KOT_USER_ID') ?? '',
  KOT_USER_PASSWORD: Deno.env.get('KOT_USER_PASSWORD') ?? '',
  SLACK_WEBHOOK_URL: Deno.env.get('KOT_PUNCHER_SLACK_WEBHOOK_URL') ?? '',
  SLACK_PUNCH_IN_MESSAGES: Deno.env.get('SLACK_PUNCH_IN_MESSAGES') ?? 'hi',
  SLACK_PUNCH_OUT_MESSAGES: Deno.env.get('SLACK_PUNCH_OUT_MESSAGES') ?? 'bye',
} as const
