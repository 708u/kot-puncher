import {Option} from '@/lib/command.ts'
import {ExhaustiveError} from '@/lib/error.ts'
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
  option: Option
}

export const kotPuncherPunchInScenarioRunner = (option: Option): KotPuncherScenarioRunner => {
  return {
    preCheck: async () => {
      const timeCard = await extractTimeCardByTargetDate(option)
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
      const timeCard = await extractTimeCardByTargetDate(option)
      return timeCard.begin !== ''
    },
    option,
  }
}

export const createKotPuncherScenarioRunnerByMode = (option: Option): KotPuncherScenarioRunner => {
  switch (option.mode) {
    case 'punch-in':
      return kotPuncherPunchInScenarioRunner(option)
    // TODO: implement other scenarios
    case 'punch-out':
      return kotPuncherPunchInScenarioRunner(option)
    // TODO: implement other scenarios
    case 'rest-begin':
      return kotPuncherPunchInScenarioRunner(option)
    // TODO: implement other scenarios
    case 'rest-end':
      return kotPuncherPunchInScenarioRunner(option)
    default:
      throw new ExhaustiveError(option.mode)
  }
}

export const runScenario = async (runner: KotPuncherScenarioRunner): Promise<Result> => {
  // cancel if preCheck failed
  if (runner.option.verbose) console.log(`run preCheck ${runner.option.mode}`)
  if (!runner.option.dryRun || !runner.option.force) {
    if (!(await runner.preCheck())) {
      return {
        type: 'canceled',
        msg: `preCheck failed. mode: ${runner.option.mode}`,
      }
    }
  }

  if (!runner.option.dryRun) await runner.run()

  if (!runner.option.dryRun && !(await runner.postCheck())) {
    return {
      type: 'failed',
      msg: `postCheck failed. mode: ${runner.option.mode}`,
    }
  }

  return {
    type: 'success',
    msg: `${runner.option.mode} finished successfully.`,
  }
}
