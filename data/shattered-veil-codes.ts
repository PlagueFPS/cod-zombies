export const codeWords = [
  "CRAB",
  "YETI",
  "MOTH",
  "WORM"
] as const

export type Code = (typeof codeWords)[number]

export const chalkboardCodes = {
  "E": {
    "CRAB": 9729,
    "YETI": 3192,
    "MOTH": 7394,
    "WORM": 9377
  },
  "BCDEF": {
    "CRAB": 5775,
    "YETI": 3576,
    "MOTH": 1676,
    "WORM": 7671
  },
  "OSTUHJLD": {
    "CRAB": 4664,
    "YETI": 5482,
    "MOTH": 1888,
    "WORM": 5861
  },
  "AIOUY": {
    "CRAB": 7857,
    "YETI": 5785,
    "MOTH": 8587,
    "WORM": 8588
  }
} as const

export type ChalkboardLetters = keyof typeof chalkboardCodes