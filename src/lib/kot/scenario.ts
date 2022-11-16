import {Option} from '@/lib/command.ts'
import {ExhaustiveError} from '@/lib/errpr.ts'
import {logIn} from '@/lib/kot/crawl/login.ts'
import {selector} from '@/lib/kot/crawl/selector.ts'
import {getRoute, routes} from '@/lib/kot/route.ts'
import {format} from 'https://deno.land/std@0.163.0/datetime/mod.ts'
import {ensureDir} from 'https://deno.land/std@0.163.0/fs/mod.ts'
import {join} from 'https://deno.land/std@0.163.0/path/mod.ts'
import puppeteer, {Page} from 'https://deno.land/x/puppeteer@16.2.0/mod.ts'

export const run = async (option: Option): Promise<void> => {
  const outDir = join(option.outDirBase, 'screenshot', format(new Date(), 'yyyyMMddHHmmss'))
  ensureDir(outDir)

  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  // login to recorder page
  await page.goto(getRoute(routes.recorder))
  const recorderPage = await logIn(page)

  // exec scenario by mode
  switch (option.mode) {
    case 'punchIn':
      punchIn(recorderPage, option)
      break
    case 'punchOut':
      punchOut(recorderPage, option)
      break
    default:
      throw new ExhaustiveError(option.mode)
  }

  await page.screenshot({path: join(outDir, 'punch_in_result.png')})
  await browser.close()
}

const punchIn = async (page: Page, option: Option): Promise<void> => {
  if (!option.dryRun) {
    await page.click(selector.clockIn)
  }
  console.log('punch in success')
}

const punchOut = async (page: Page, option: Option): Promise<void> => {
  if (!option.dryRun) {
    await page.click(selector.clockOut)
  }
  console.log('punch out success')
}
