export const ENV = {
  KOT_URL: Deno.env.get('KOT_URL') || '',
  KOT_USER_ID: Deno.env.get('KOT_USER_ID') || '',
  KOT_USER_PASSWORD: Deno.env.get('KOT_USER_PASSWORD') || '',
  SLACK_WEBHOOK_URL: Deno.env.get('KOT_PUNCHER_SLACK_WEBHOOK_URL') || '',
} as const
