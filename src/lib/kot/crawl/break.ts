import {RestButtonIndex, selector} from '@/lib/kot/crawl/selector.ts'
import {Page} from 'puppeteer'

export const runBreak = async (page: Page, btnIndx: RestButtonIndex): Promise<void> => {
  const recordList = await page.$$(selector.recorder.recordList)

  const recordButton = await recordList[btnIndx].$(selector.recorder.recordBtnClass)
  if (!recordButton) throw new Error(`record button not found. bntIndx: ${btnIndx}`)

  // TODO: wait until record button is clickable
  await new Promise(function (resolve) {
    setTimeout(resolve, 1000)
  })

  return await recordButton.click()
}
