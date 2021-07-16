import { AuthenticationError, ForbiddenError, UserInputError } from '@vtex/api'
import type { AxiosError } from 'axios'

const CALLS_PER_MINUTE = 1600
const ONE_MINUTE = 60 * 1000
export const BUCKET_NAME = 'product-translation'
export const ALL_TRANSLATIONS_FILES = 'all-translations'

export const statusToError = (e: AxiosError) => {
  if (!e.response) {
    throw e
  }

  const {
    response: { status },
  } = e

  switch (status) {
    case 401: {
      throw new AuthenticationError(e)
    }

    case 403: {
      throw new ForbiddenError(e)
    }

    case 400: {
      throw new UserInputError(e)
    }

    default:
      throw new TypeError(e.message)
  }
}

export const MAX_PRODUCTS_PER_CATEGORY = 50

/* export const interations = (total: number) => {
  return (
    Math.floor(total / MAX_PRODUCTS_PER_CATEGORY) -
    (total % MAX_PRODUCTS_PER_CATEGORY ? 0 : 1)
  )
}

export const getInterationPairs = (currentStep: number): number[] => [
  MAX_PRODUCTS_PER_CATEGORY * currentStep + 1,
  MAX_PRODUCTS_PER_CATEGORY * currentStep + 50,
]

export const extractProductId = (productResponse: Record<string, number[]>) => {
  return Object.keys(productResponse)
}

export const pacer = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve('done')
    }, ONE_MINUTE / CALLS_PER_MINUTE)
  })

export const calculateExportProcessTime = (size: number): number =>
  Math.ceil(size * (ONE_MINUTE / CALLS_PER_MINUTE))
 */