import {Option} from '@/lib/command.ts'
import {ExhaustiveError} from '@/lib/error.ts'
import {runBreak} from '@/lib/kot/crawl/break.ts'
import {logIn} from '@/lib/kot/crawl/login.ts'
import {restButtonIndex, selector} from '@/lib/kot/crawl/selector.ts'
import {extractTimeCardByTargetDate} from '@/lib/kot/crawl/time_card.ts'
import {Result} from '@/lib/kot/scenario.ts'
import puppeteer from 'puppeteer'
import {join} from 'std/path'

export type KotPuncherScenarioRunner = {
  preCheck(): Promise<Result>
  run(): Promise<void>
  postCheck(): Promise<Result>
  option: Option
}

export const kotPuncherPunchInScenarioRunner = (option: Option): KotPuncherScenarioRunner => {
  return {
    preCheck: async () => {
      const timeCard = await extractTimeCardByTargetDate(option)
      if (option.verbose) console.log(timeCard)
      return timeCard.begin === '' ? {type: 'success', msg: 'success'} : {type: 'canceled', msg: 'already punched in'}
    },
    run: async () => {
      const browser = await puppeteer.launch()

      // login to recorder page
      const recorderPage = await logIn(await browser.newPage())
      if (option.verbose) console.log(`login success: navigate to recode page for ${option.mode}`)

      // exec punch-in
      if (!option.dryRun) await recorderPage.click(selector.recorder.clockIn, {delay: 5000})
      if (option.verbose) console.log(`${option.mode} success in executing scenario`)

      await recorderPage.screenshot({path: join(option.screenShotDir, `${option.mode}-success.png`)})
      await browser.close()
    },
    postCheck: async () => {
      const timeCard = await extractTimeCardByTargetDate(option)
      if (option.verbose) console.log(timeCard)
      return timeCard.begin !== ''
        ? {type: 'success', msg: 'success'}
        : {type: 'failed', msg: 'timecard not updated properly'}
    },
    option,
  }
}

export const kotPuncherPunchOutScenarioRunner = (option: Option): KotPuncherScenarioRunner => {
  return {
    preCheck: async () => {
      const timeCard = await extractTimeCardByTargetDate(option)
      if (option.verbose) console.log(timeCard)
      return timeCard.end === '' ? {type: 'success', msg: 'success'} : {type: 'canceled', msg: 'already punched out'}
    },
    run: async () => {
      const browser = await puppeteer.launch()

      // login to recorder page
      const recorderPage = await logIn(await browser.newPage())
      if (option.verbose) console.log(`login success: navigate to recode page for ${option.mode}`)

      // exec punch-out
      if (!option.dryRun) await recorderPage.click(selector.recorder.clockOut)
      if (option.verbose) console.log(`${option.mode} success in executing scenario`)

      await recorderPage.screenshot({path: join(option.screenShotDir, `${option.mode}-success.png`)})
      await browser.close()
    },
    postCheck: async () => {
      const timeCard = await extractTimeCardByTargetDate(option)
      if (option.verbose) console.log(timeCard)
      return timeCard.end !== '' ? {type: 'success', msg: 'success'} : {type: 'failed', msg: 'punch-out failed'}
    },
    option,
  }
}

export const kotPuncherRestBeginScenarioRunner = (option: Option): KotPuncherScenarioRunner => {
  return {
    preCheck: async () => {
      const timeCard = await extractTimeCardByTargetDate(option)
      if (option.verbose) console.log(timeCard)
      // begin must be set because rest begin can be executed only after punch-in
      return timeCard.begin !== '' && timeCard.restBegin === ''
        ? {type: 'success', msg: 'success'}
        : {type: 'canceled', msg: 'already rest begin or not punched in'}
    },
    run: async () => {
      const browser = await puppeteer.launch()

      // login to recorder page
      const recorderPage = await logIn(await browser.newPage())
      if (option.verbose) console.log(`login success: navigate to recode page for ${option.mode}`)

      // exec rest-begin
      if (!option.dryRun) await runBreak(recorderPage, restButtonIndex.begin)
      if (option.verbose) console.log(`${option.mode} success in executing scenario`)

      await recorderPage.screenshot({path: join(option.screenShotDir, `${option.mode}-success.png`)})
      await browser.close()
    },
    postCheck: async () => {
      const timeCard = await extractTimeCardByTargetDate(option)
      if (option.verbose) console.log(timeCard)
      return timeCard.restBegin !== '' && timeCard.restEnd !== ''
        ? {type: 'success', msg: 'success'}
        : {type: 'failed', msg: 'rest-begin failed'}
    },
    option,
  }
}

export const kotPuncherRestEndScenarioRunner = (option: Option): KotPuncherScenarioRunner => {
  return {
    preCheck: async () => {
      const timeCard = await extractTimeCardByTargetDate(option)
      if (option.verbose) console.log(timeCard)
      // begin and rest begin must be set because rest end can be executed only after punch-in and rest begin
      // return timeCard.begin !== '' && timeCard.restBegin !== '' && timeCard.restEnd === ''
      return timeCard.begin !== '' && timeCard.restBegin !== '' && timeCard.restEnd === ''
        ? {type: 'success', msg: 'success'}
        : {type: 'canceled', msg: 'already rest end or not rest begin'}
    },
    run: async () => {
      const browser = await puppeteer.launch()

      // login to recorder page
      const recorderPage = await logIn(await browser.newPage())
      if (option.verbose) console.log(`login success: navigate to recode page for ${option.mode}`)

      // exec rest-end
      if (!option.dryRun) await runBreak(recorderPage, restButtonIndex.end)
      if (option.verbose) console.log(`${option.mode} success in executing scenario`)

      await recorderPage.screenshot({path: join(option.screenShotDir, `${option.mode}-success.png`)})
      await browser.close()
    },
    postCheck: async () => {
      const timeCard = await extractTimeCardByTargetDate(option)
      if (option.verbose) console.log(timeCard)
      return timeCard.begin !== '' && timeCard.restBegin !== '' && timeCard.restEnd !== ''
        ? {type: 'success', msg: 'success'}
        : {type: 'failed', msg: 'rest-end failed'}
    },
    option,
  }
}

export const createKotPuncherScenarioRunnerByMode = (option: Option): KotPuncherScenarioRunner => {
  switch (option.mode) {
    case 'punch-in':
      return kotPuncherPunchInScenarioRunner(option)
    case 'punch-out':
      return kotPuncherPunchOutScenarioRunner(option)
    case 'rest-begin':
      return kotPuncherRestBeginScenarioRunner(option)
    case 'rest-end':
      return kotPuncherRestEndScenarioRunner(option)
    default:
      throw new ExhaustiveError(option.mode)
  }
}

export const runScenario = async (runner: KotPuncherScenarioRunner): Promise<Result> => {
  // cancel if preCheck failed
  if (runner.option.verbose) console.log(`run preCheck ${runner.option.mode}`)
  if (!runner.option.dryRun && !runner.option.force) {
    const result = await runner.preCheck()
    if (result.type === 'canceled') {
      return {
        type: 'canceled',
        msg: `preCheck failed. mode: ${runner.option.mode}, reason: ${result.msg}`,
      }
    }
  }

  if (runner.option.verbose) console.log(`run scenario ${runner.option.mode}`)
  if (!runner.option.dryRun) await runner.run()

  if (runner.option.verbose) console.log(`run postCheck ${runner.option.mode}`)
  if (!runner.option.dryRun) {
    const result = await runner.postCheck()
    if (result.type === 'failed') {
      return {
        type: 'failed',
        msg: `postCheck failed. mode: ${runner.option.mode}, reason: ${result.msg}`,
      }
    }
  }

  return {
    type: 'success',
    msg: `${runner.option.mode} finished successfully.`,
  }
}
