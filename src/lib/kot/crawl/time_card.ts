import {Option} from '@/lib/command.ts'
import {logIn} from '@/lib/kot/crawl/login.ts'
import {selector} from '@/lib/kot/crawl/selector.ts'
import puppeteer from 'https://deno.land/x/puppeteer@16.2.0/mod.ts'

export const hasAlreadyPunched = async (option: Option): Promise<boolean> => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await logIn(page)
  console.log('login success')

  // wait until menu is clickable
  await new Promise(r => setTimeout(r, 1000))
  await page.click(selector.recorder.humbuggerMenu.id)
  await page.click(selector.recorder.humbuggerMenu.timeCard)

  await page.waitForNavigation()
  await new Promise(r => setTimeout(r, 500))

  // TODO: implement timecard check

  await page.close()
  await browser.close()

  // TODO: fix
  return false
}
