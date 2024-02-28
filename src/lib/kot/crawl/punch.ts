import {Option} from '@/lib/command.ts'
import {logIn} from '@/lib/kot/crawl/login.ts'
import {RestButtonIndex, restButtonIndex, selector} from '@/lib/kot/crawl/selector.ts'
import {join} from 'std/path'

import puppeteer, {Page} from 'puppeteer'

type PunchCallback = (recorderPage: Page) => Promise<void>

const wait = async (ms: number): Promise<void> => await new Promise(resolve => setTimeout(resolve, ms))

// run general punch scenario
// 1. login to recorder page
// 2. exec scenario that clicks record button
export const runPunch = async (option: Option, punchCallback: PunchCallback): Promise<void> => {
  const browser = await puppeteer.launch()

  // login to recorder page
  const recorderPage = await logIn(await browser.newPage())
  if (option.verbose) console.log(`login success: navigate to recode page for ${option.mode}`)

  // TODO: wait until recorder page is loaded
  await wait(4000)

  // exec scenario in recorder page
  if (option.verbose) console.log(`${option.mode} click record button`)
  if (!option.dryRun) await punchCallback(recorderPage)
  if (option.verbose) console.log(`${option.mode} success in executing scenario`)

  await recorderPage.screenshot({path: join(option.screenShotDir, `${option.mode}-success.png`)})
  await browser.close()
}

// break
const runBreak = async (page: Page, btnIndx: RestButtonIndex): Promise<void> => {
  const recordList = await page.$$(selector.recorder.recordList)

  const recordButton = await recordList[btnIndx].$(selector.recorder.recordBtnClass)
  if (!recordButton) throw new Error(`record button not found. bntIndx: ${btnIndx}`)

  // TODO: wait until record button is clickable
  await wait(1000)

  return await recordButton.click()
}

export const punchIn: PunchCallback = async recorderPage => await recorderPage.click(selector.recorder.clockIn)
export const punchOut: PunchCallback = async recorderPage => await recorderPage.click(selector.recorder.clockOut)
export const restBegin: PunchCallback = async page => await runBreak(page, restButtonIndex.begin)
export const restEnd: PunchCallback = async page => await runBreak(page, restButtonIndex.end)
