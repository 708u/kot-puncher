import {ENV} from '@/environment.ts'

const baseUrl = new URL(ENV.KOT_URL)

export const routes = {
  recorder: 'independent/recorder/personal',
} as const

export const getRoute = (path: string): string => {
  const url = {}
  Object.assign(url, baseUrl)

  baseUrl.pathname = path
  return baseUrl.toString()
}
