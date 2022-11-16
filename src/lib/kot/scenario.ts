import {Option} from '@/lib/command.ts'
import {ExhaustiveError} from '@/lib/error.ts'
import {logIn} from '@/lib/kot/crawl/login.ts'
import {selector} from '@/lib/kot/crawl/selector.ts'
import {hasAlreadyPunched} from '@/lib/kot/crawl/time_card.ts'
import {format} from 'https://deno.land/std@0.163.0/datetime/mod.ts'
import {ensureDir} from 'https://deno.land/std@0.163.0/fs/mod.ts'
import {join} from 'https://deno.land/std@0.163.0/path/mod.ts'
import puppeteer from 'https://deno.land/x/puppeteer@16.2.0/mod.ts'

// TODO: add result object
export const run = async (option: Option): Promise<void> => {
  const outDir = join(option.outDirBase, 'screenshot', format(new Date(), 'yyyyMMddHHmmss'))
  ensureDir(outDir)

  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  // login to recorder page
  const recorderPage = await logIn(page)
  if (option.verbose) console.log(`login success: navigate to recode page for ${option.mode}`)

  // cancel punch-in / out if user has already recorded time card at target date
  if (option.verbose) console.log(`determine if user has already ${option.mode}`)
  if (await hasAlreadyPunched(option)) {
    console.log(`you have already recorded time card at target date. mode: ${option.mode}`)
    await browser.close()
    return
  }
  // exec scenario by mode
  switch (option.mode) {
    case 'punch-out':
      if (!option.dryRun) await recorderPage.click(selector.recorder.clockIn)
      if (option.verbose) console.log('punch in success')
      break
    case 'punch-in':
      if (!option.dryRun) await recorderPage.click(selector.recorder.clockOut)
      if (option.verbose) console.log('punch out success')
      break
    default:
      throw new ExhaustiveError(option.mode)
  }

  // check if punch in / out is finished successfully
  if (option.verbose) console.log(`determine if ${option.mode} finished successfully`)
  if (await !hasAlreadyPunched(option)) {
    await recorderPage.screenshot({path: join(outDir, `${option.mode}_failed.png`)})
    await browser.close()
    throw new Error(`${option.mode} finished but record dose not exist in time card table`)
  }

  await recorderPage.screenshot({path: join(outDir, `${option.mode}-success.png`)})
  await browser.close()
}
