import {
  IDBGenerateTokenResponse,
  IAWSGenerateTokenResponse,
  IAWSGetTokenOptions,
  IDBGetTokenOptions,
  ICachingUtilsOptions,
  ICachedCreds,
  KvEngineVersion
} from './interfaces';


export class CachingUtils {

  constructor(private options: ICachingUtilsOptions) { }

  private async getCachedCreds(cacheEngineName: string, cachePath: string, token: string) {
    const opts = { engineName: cacheEngineName, token, engineVersion: KvEngineVersion.v1 };
    let creds;

    try {
      creds = await this.options.kvSecretEngine.getSecret<ICachedCreds>(opts, cachePath);

      return creds && this.checkExpiry(creds.exp) ? creds.data : null;
    }

    catch (err) {
      if (err.statusCode === 404) return null;

      throw err;
    }
  }

  private async setCachedCreds(cacheEngineName: string, cachePath: string, token: string, ttl: number, data: any) {
    const opts = { engineName: cacheEngineName, token, engineVersion: KvEngineVersion.v1 };

    await this.options.kvSecretEngine.createSecret(opts, cachePath, { exp: this.getExpiry(ttl), data });
  }

  private getExpiry(secs: number) {
    // TODO: check if we need math.floor
    return (new Date().getTime() + (secs * 1000)) / 1000;
  }

  private checkExpiry(exp: number) {
    return ((exp * 1000) - (new Date().getTime())) > 0;
  }

  async getAWSCreds(options: IAWSGetTokenOptions): Promise<IAWSGenerateTokenResponse> {
    let cachedCreds = await this.getCachedCreds(options.cacheEngineName, options.cachePath, options.token);

    if (!cachedCreds) {
      cachedCreds = await this.options.awsSecretEngine.generateCreds(options);
      await this.setCachedCreds(options.cacheEngineName, options.cachePath, options.token, options.cachettl, cachedCreds);
    }

    return cachedCreds;
  }

  async getDBCreds(options: IDBGetTokenOptions): Promise<IDBGenerateTokenResponse> {
    let cachedCreds = await this.getCachedCreds(options.cacheEngineName, options.cachePath, options.token);

    if (!cachedCreds) {
      cachedCreds = await this.options.dbSecretEngine.generateCreds(options);
      await this.setCachedCreds(options.cacheEngineName, options.cachePath, options.token, options.cachettl, cachedCreds);
    }

    return cachedCreds;
  }
}