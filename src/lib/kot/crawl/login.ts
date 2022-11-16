import {KOT_USER_ID, KOT_USER_PASSWORD} from '@/environment.ts'
import {selector} from '@/lib/kot/crawl/selector.ts'
import {Page} from 'https://deno.land/x/puppeteer@16.2.0/mod.ts'

export const logIn = async (page: Page): Promise<Page> => {
  await page.waitForSelector('.btn-control-message')
  await page.type('#id', KOT_USER_ID)
  await page.type('#password', KOT_USER_PASSWORD)
  await page.click(selector.submitLogin)
  await page.waitForSelector(selector.clockIn)

  console.log('login success')
  return page
}
