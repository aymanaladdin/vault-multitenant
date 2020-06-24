import { IAppExtension, ICustomProvider, BxApp } from '@bluemax/core';
import { IVaultExtOptions, IVaultErrorHandler, IVaultAuthInfoParser, IVaultAuthInfo } from './interfaces';
import { VaultService } from './vault.service';
import { AWSSecretEngine, KVSecretEngine, DBSecretEngine, CachingUtils } from './secret-engines';
import { AppRoleAuthEngine } from './auth-engines/app-role';

export class VaultMultitenant implements IAppExtension {

  globalProviders: ICustomProvider[];
  vaultService: VaultService;
  errorHandling: IVaultErrorHandler;
  getAuthInfo: IVaultAuthInfoParser;

  constructor(bxApp: BxApp, options?: IVaultExtOptions) {
    options = options || {};
    this.vaultService = new VaultService(options.vaultOptions);
    this.errorHandling = options.errorHandling || this.defaultErrorHandler;
    this.getAuthInfo = options.getAuthInfo || this.defaultAuthInfoParser;

    const awsSecretEngine = new AWSSecretEngine(this.vaultService);
    const dbSecretEngine = new DBSecretEngine(this.vaultService);
    const kvSecretEngine = new KVSecretEngine(this.vaultService);
    const appRoleAuthEngine = new AppRoleAuthEngine(this.vaultService);

    const cachingWrapper = new CachingUtils({
      awsSecretEngine,
      dbSecretEngine,
      kvSecretEngine
    });

    this.globalProviders = [
      {
        provider: VaultMultitenant,
        use: this
      },
      {
        provider: AWSSecretEngine,
        use: awsSecretEngine
      },
      {
        provider: DBSecretEngine,
        use: dbSecretEngine
      },
      {
        provider: KVSecretEngine,
        use: kvSecretEngine
      },
      {
        provider: AppRoleAuthEngine,
        use: appRoleAuthEngine
      },
      {
        provider: CachingUtils,
        use: cachingWrapper
      }
    ];
  }

  private defaultErrorHandler(error: Error) {
    return {
      message: error.message
    };
  }

  private defaultAuthInfoParser(req: any): IVaultAuthInfo {
    if (!req.auth || !req.auth.token) {
      throw new Error('token not found!');
    }

    if (!req.auth.realm) {
      throw new Error('unable to determine realm from the request!');
    }

    return {
      token: req.auth.token,
      authEngineName: req.auth.realm + '/jwt'
    };
  }
}