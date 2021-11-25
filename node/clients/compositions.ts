import { InstanceOptions, IOContext, ExternalClient } from '@vtex/api'

export default class Compositions extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(`http://${context.account}.myvtex.com`, context, {
      ...options,
    })
  }

  public async getCompositionsFromMaster(masterSeller: string) {
    try {
      const res = await this.http.getRaw(
        `http://${masterSeller}.myvtex.com/v1/compositionFile`
      )

      return res
    } catch (err) {
      return err
    }
  }
}
