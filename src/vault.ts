import { IAppExtension, ICustomProvider, BxApp } from '@bluemax/core';
import { IVaultExtOptions, IVaultErrorHandler, IVaultAuthInfoParser, IVaultAuthInfo } from './interfaces';
import { VaultService } from './vault.service';
import { AWSSecretEngine } from './secret-engines';
import { DBSecretEngine } from './secret-engines/database';


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

    this.globalProviders = [
      {
        provider: VaultMultitenant,
        use: this
      },
      {
        provider: AWSSecretEngine,
        use: new AWSSecretEngine(this.vaultService)
      },
      {
        provider: DBSecretEngine,
        use: new DBSecretEngine(this.vaultService)
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