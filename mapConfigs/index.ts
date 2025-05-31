export const mapRegistry = {
  'shattered-veil': () => import('./shattered-veil').then((module) => module.default),
  'the-tomb': () => import('./the-tomb').then((module) => module.default),
  'citadelle-des-morts': () => import('./citadelle-des-morts').then((module) => module.default),
  'terminus': () => import('./terminus').then((module) => module.default),
  'liberty-falls': () => import('./liberty-falls').then((module) => module.default),
} as const

export type MapId = keyof typeof mapRegistry