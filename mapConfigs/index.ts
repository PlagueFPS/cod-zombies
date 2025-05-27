export const mapRegistry = {
  'shattered-veil': () => import('./shattered-veil').then((module) => module.default),
} as const

export type MapId = keyof typeof mapRegistry

