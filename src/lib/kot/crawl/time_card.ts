import {Option} from '@/lib/command.ts'
import {ExhaustiveError} from '@/lib/error.ts'
import {logIn} from '@/lib/kot/crawl/login.ts'
import {parseDateFromTimeCardTableData, selector} from '@/lib/kot/crawl/selector.ts'
import {format} from 'https://deno.land/std@0.163.0/datetime/mod.ts'
import puppeteer, {ElementHandle, Page} from 'https://deno.land/x/puppeteer@16.2.0/mod.ts'
type TimeCard = {
  begin?: string
  end?: string
}

export const hasAlreadyPunched = async (option: Option): Promise<boolean> => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await logIn(page)
  if (option.verbose) console.log(`login success: determine if user has already ${option.mode}`)

  // wait until menu is clickable
  await new Promise(r => setTimeout(r, 1000))
  await page.click(selector.recorder.humbuggerMenu.id)
  await page.click(selector.recorder.humbuggerMenu.timeCard)

  await page.waitForNavigation()
  await new Promise(r => setTimeout(r, 500))

  if (option.verbose) console.log('extract time card info from time card table')
  const timeCards = await extractTimeCard(page)
  await page.close()
  await browser.close()

  // TODO: switch by target date
  const timeCard = timeCards.get(format(new Date(), 'MM/dd'))
  if (!timeCard) return false

  switch (option.mode) {
    case 'punch-in':
      return timeCard.begin !== ''
    case 'punch-out':
      return timeCard.end !== ''
    default:
      throw new ExhaustiveError(option.mode)
  }
}

const extractTimeCard = async (page: Page): Promise<Map<string, TimeCard>> => {
  const toString = async (data: ElementHandle | null): Promise<string> => {
    if (data === null) return ''
    const tdValueSelector = await data.getProperty('textContent')
    const tdValue = (await tdValueSelector?.jsonValue()) as string
    // transform C\n\n01:01 (月) to 01:01 (月)
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

    timeCards.set(date, {
      begin: begin,
      end: end,
    })
  }
  return timeCards
}
