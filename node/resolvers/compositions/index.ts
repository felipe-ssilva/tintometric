export const queries = {
  getCompositionFile: async (
    _: unknown,
    { masterSeller }: { masterSeller: string },
    ctx: Context
  ): Promise<any> => {
    const {
      clients: { apps, vtexID },
    } = ctx

    try {
      const appId = process.env.VTEX_APP_ID
      const { appKey, appToken } = await apps.getAppSettings(appId)

      const responseToken: ResponseToken = await vtexID.login(appKey, appToken)

      const { token } = responseToken
      const { data } = await ctx.clients.compositions.getCompositionsFromMaster(
        masterSeller,
        token
      )

      return data
    } catch (error) {
      return `${error}`
    }
  },
}
