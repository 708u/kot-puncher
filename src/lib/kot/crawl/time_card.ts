import {Option} from '@/lib/command.ts'
import {logIn} from '@/lib/kot/crawl/login.ts'
import {parseDateFromTimeCardTableData, selector} from '@/lib/kot/crawl/selector.ts'
import puppeteer, {ElementHandle, Page} from 'puppeteer'
import {format} from 'std/datetime'
import {join} from 'std/path'
type TimeCard = {
  begin?: string
  end?: string
  restBegin?: string
  restEnd?: string
}

export const extractTimeCardByTargetDate = async (option: Option): Promise<TimeCard> => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await logIn(page)
  if (option.verbose) console.log(`login success: determine if user has already ${option.mode}`)

  // wait until menu is clickable
  await new Promise(r => setTimeout(r, 1000))
  await page.click(selector.recorder.humbuggerMenu.id)
  await page.click(selector.recorder.humbuggerMenu.timeCard)

  await page.waitForNavigation()
  await new Promise(r => setTimeout(r, 2000))

  if (option.verbose) console.log('extract time card info from time card table')
  const timeCards = await extractTimeCard(page)

  const timeCard = timeCards.get(format(option.targetDate, 'MM/dd'))
  if (!timeCard) {
    await page.screenshot({path: join(option.screenShotDir, `${option.mode}-fail-extract-time-card.png`)})
    await page.close()
    await browser.close()
    throw new Error('time card is undefined unexpectedly')
  }

  await page.close()
  await browser.close()
  return timeCard
}

const extractTimeCard = async (page: Page): Promise<Map<string, TimeCard>> => {
  const toString = async (data: ElementHandle | null): Promise<string> => {
    if (data === null) return ''
    const tdValueSelector = await data.getProperty('textContent')
    const tdValue = (await tdValueSelector?.jsonValue()) as string
    // transform td like `C\n\n01:01 (月)` to `01:01 (月)`
    return tdValue
      .trim()
      .split(/\n/g)
      .filter(v => v !== '')
      .join('')
      .replace('C', '')
  }

  const timeCards = new Map<string, TimeCard>()
  const tr = await page.$$(selector.timeCard.tableRaw)
  for (const td of tr) {
    const date = parseDateFromTimeCardTableData(await toString(await td.$('.htBlock-scrollTable_day')))
    if (date === '') throw new Error(`date must be filled`)

    const startAndEndDate = await td.$$(selector.timeCard.startAndEndDate)
    const begin = await toString(startAndEndDate[0])
    const end = await toString(startAndEndDate[1])

    const restStartAndEndDate = await td.$$(selector.timeCard.rest)
    const restBegin = await toString(restStartAndEndDate[0])
    const restEnd = await toString(restStartAndEndDate[1])

    timeCards.set(date, {
      begin: begin,
      end: end,
      restBegin: restBegin,
      restEnd: restEnd,
    })
  }
  return timeCards
}
