import {KOT_USER_ID, KOT_USER_PASSWORD} from '@/environment.ts'
import {selector} from '@/lib/kot/crawl/selector.ts'
import {getRoute, routes} from '@/lib/kot/route.ts'
import {Page} from 'puppeteer'

export const logIn = async (page: Page): Promise<Page> => {
  await page.goto(getRoute(routes.recorder))
  await page.waitForSelector('.btn-control-message')

  // login user
  await page.type('#id', KOT_USER_ID)
  await page.type('#password', KOT_USER_PASSWORD)
  await page.click(selector.login.submit)
  await page.waitForSelector(selector.recorder.clockIn)

  return page
}
