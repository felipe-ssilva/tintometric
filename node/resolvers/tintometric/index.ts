// import { base64ToCSV, csvJSON } from '../../utils'

import { parseCSVToJson, validateNewPrices } from '../../utils'

export const queries = {}

export const mutations = {
  updateSkusPrices: async (
    _: unknown,
    {
      tinter1,
      tinter2,
      tinter3,
      tinter4,
      tinter5,
      tinter6,
      tinter7,
      tinter8,
      tinter9,
      tinter10,
      tinter11,
      tinter12,
      tinter13,
      oldPrices,
    }: {
      tinter1: number
      tinter2: number
      tinter3: number
      tinter4: number
      tinter5: number
      tinter6: number
      tinter7: number
      tinter8: number
      tinter9: number
      tinter10: number
      tinter11: number
      tinter12: number
      tinter13: number
      oldPrices: boolean
    },
    { clients: { pricing, catalog, vbase, files } }: Context
  ): Promise<string> => {
    const products: any = await catalog.getProducts()

    try {
      const jsonUrl = await vbase.getJSON<string>('tintometricData', 'jsonFile')
      const jsonFileContent = await files.getFile(jsonUrl)

      const csvUrl = await vbase.getJSON<string>('tintometricData', 'csvFile')
      const { data: csvData } = await files.getFile(csvUrl)
      const csv: Array<{ base: string; price: string }> = parseCSVToJson(
        csvData
      )

      // cambiar el nombre de csvFile_old para probar qué pasa si no existe aún el archivo viejo
      const lastCsvUrl = await vbase.getJSON<string>(
        'tintometricData',
        'csvFile_old'
      )

      if (lastCsvUrl) {
        const { data: lastCsvData } = await files.getFile(lastCsvUrl)

        const lastCsv: Array<{ base: string; price: string }> = parseCSVToJson(
          lastCsvData
        )

        console.log('csv---', csv)
        console.log('lastCsv---', lastCsv)

        const validate = validateNewPrices(lastCsv, csv)

        if (validate.length > 0) {
          return JSON.stringify({
            errorValidatePrice: validate,
            skusNotFound: [],
            skusBadStructure: [],
            baseNotFound: [],
          })
        }
      }

      console.log('no llego aca')

      const jsonProducts = jsonFileContent.data?.products
      const priceType = oldPrices ? 'loc' : 'acotone'
      const skusNotFound: number[] = []
      const skusBadStructure: number[] = []
      const baseNotFound: number[] = []

      jsonProducts.forEach((item: JsonItem) => {
        if (!item.skuId) return
        const skuId = products.find((element: string) => {
          return Number(element) === item.skuId
        })

        if (!skuId) {
          skusNotFound.push(item.skuId)
        } else if (item.composition) {
          let base = 0

          const baseJson: any = Object.entries(
            item.composition[priceType]
          ).find((arrayOfItem: any) => arrayOfItem[0].includes('base'))

          const basePrice =
            baseJson && csv.find((csvItem: any) => csvItem.base === baseJson[0])

          if (!basePrice) {
            baseJson
              ? baseNotFound.push(baseJson[0])
              : baseNotFound.push(item.skuId)
          } else if (!baseJson) {
            skusBadStructure.push(item.skuId)
          } else {
            base = baseJson[1] * Number(basePrice.price)
          }

          console.log(`${tinter1} (tinter1) * ${item?.composition?.[priceType]?.tinter1} (item?.composition?.[priceType]?.tinter1) +
            ${tinter2} (tinter2) * ${item?.composition?.[priceType]?.tinter2} (item?.composition?.[priceType]?.tinter2) +
            ${tinter3} (tinter3) * ${item?.composition?.[priceType]?.tinter3} (item?.composition?.[priceType]?.tinter3) +
            ${tinter4} (tinter4) * ${item?.composition?.[priceType]?.tinter4} (item?.composition?.[priceType]?.tinter4) + ${base} (base)`)

          console.log(
            'finalPrice',
            tinter1 * item?.composition?.[priceType]?.tinter1 +
            tinter2 * item?.composition?.[priceType]?.tinter2 +
            tinter3 * item?.composition?.[priceType]?.tinter3 +
            tinter4 * item?.composition?.[priceType]?.tinter4 +
            base
          )
          let price =
            tinter1 * item?.composition?.[priceType]?.tinter1 +
            tinter2 * item?.composition?.[priceType]?.tinter2 +
            tinter3 * item?.composition?.[priceType]?.tinter3 +
            tinter4 * item?.composition?.[priceType]?.tinter4 +
            tinter5 * item?.composition?.[priceType]?.tinter5 +
            tinter6 * item?.composition?.[priceType]?.tinter6 +
            tinter7 * item?.composition?.[priceType]?.tinter7 +
            tinter8 * item?.composition?.[priceType]?.tinter8 +
            tinter9 * item?.composition?.[priceType]?.tinter9 +
            tinter10 * item?.composition?.[priceType]?.tinter10 +
            tinter11 * item?.composition?.[priceType]?.tinter11 +
            base

          if (!oldPrices)
            price +=
              tinter12 * item?.composition?.[priceType]?.tinter12 +
              tinter13 * item?.composition?.[priceType]?.tinter13

          if (Number.isNaN(price)) {
            skusBadStructure.push(item.skuId)
          } else {
            try {
              pricing.updateSkuPrice(item.skuId, price, price, price * 1.3)
            } catch (err) {
              return err
            }
          }
        }
      })

      return JSON.stringify({
        skusNotFound,
        skusBadStructure,
        baseNotFound,
        errorValidatePrice: [],
      })
    } catch (err) {
      return err
    }
  },
}
