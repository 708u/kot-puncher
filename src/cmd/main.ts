import {parseArgs} from '@/lib/command.ts'
import {run} from '@/lib/kot/scenario.ts'
import {parse} from 'https://deno.land/std@0.163.0/flags/mod.ts'

const option = parseArgs(parse(Deno.args))
if (option.dryRun) console.log('dry run')

try {
  await run(option)
} catch (e) {
  console.log(`${option.mode} failed. ${e}`)
}
