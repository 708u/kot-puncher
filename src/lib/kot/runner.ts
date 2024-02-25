import {Option} from '@/lib/command.ts'
import {logIn} from '@/lib/kot/crawl/login.ts'
import {selector} from '@/lib/kot/crawl/selector.ts'
import {extractTimeCardByTargetDate} from '@/lib/kot/crawl/time_card.ts'
import {Result} from '@/lib/kot/scenario.ts'
import puppeteer from 'puppeteer'
import {join} from 'std/path'

export type KotPuncherScenarioRunner = {
  preCheck(): Promise<boolean>
  run(): Promise<void>
  postCheck(): Promise<boolean>
}

export const kotPuncherPunchInScenarioRunner = (option: Option): KotPuncherScenarioRunner => {
  return {
    preCheck: async () => {
      const timeCard = await extractTimeCardByTargetDate(new Date(), option)
      return timeCard.begin === ''
    },
    run: async () => {
      const browser = await puppeteer.launch()

      // login to recorder page
      const recorderPage = await logIn(await browser.newPage())
      if (option.verbose) console.log(`login success: navigate to recode page for ${option.mode}`)

      // exec punch-in
      if (!option.dryRun) await recorderPage.click(selector.recorder.clockIn)
      if (option.verbose) console.log(`${option.mode} success in executing scenario`)

      await recorderPage.screenshot({path: join(option.screenShotDir, `${option.mode}-success.png`)})
      await browser.close()
    },
    postCheck: async () => {
      const timeCard = await extractTimeCardByTargetDate(new Date(), option)
      return timeCard.begin !== ''
    },
  }
}

export const runScenario = async (runner: KotPuncherScenarioRunner, option: Option): Promise<Result> => {
  // cancel if preCheck failed
  if (option.verbose) console.log(`run preCheck ${option.mode}`)
  if (!option.dryRun || !option.force) {
    if (!(await runner.preCheck())) {
      return {
        type: 'canceled',
        msg: `preCheck failed. mode: ${option.mode}`,
      }
    }
  }

  if (!option.dryRun) await runner.run()

  if (!option.dryRun && !(await runner.postCheck())) {
    return {
      type: 'failed',
      msg: `postCheck failed. mode: ${option.mode}`,
    }
  }

  return {
    type: 'success',
    msg: `${option.mode} finished successfully.`,
  }
}
