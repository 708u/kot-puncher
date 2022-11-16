import {KOT_URL} from '@/environment.ts'

const baseUrl = new URL(KOT_URL)

export const routes = {
  recorder: 'independent/recorder/personal',
} as const

export const getRoute = (path: string): string => {
  const url = {}
  Object.assign(url, baseUrl)

  baseUrl.pathname = path
  return baseUrl.toString()
}
