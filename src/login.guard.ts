import { Provider, IGuardContext } from '@bluemax/core';
import { Response } from 'express';
import { VaultService } from './vault.service';
import { VaultMultitenant } from './vault';
import { IVaultErrorHandler, IVaultAuthInfoParser, IVaultAuthInfo } from './interfaces';


@Provider()
export class VaultLogin {

  private vaultService: VaultService;
  private errorHandler: IVaultErrorHandler;
  private getAuthInfo: IVaultAuthInfoParser;

  constructor(vaultExt: VaultMultitenant) {
    this.vaultService = vaultExt.vaultService;
    this.errorHandler = vaultExt.errorHandling;
    this.getAuthInfo = vaultExt.getAuthInfo;
  }

  async guard(context: IGuardContext, role: string) {
    const req: any = context.args[0];
    const res: Response = context.args[1];

    let authInfo;

    try {
      authInfo = this.getAuthInfo(req);
    }
    catch (e) {
      res.status(401).json(this.errorHandler(e));
      return false;
    }


    // TODO: handle vault errors
    const tokenInfo = await this.vaultService.login(authInfo.authEngineName, authInfo.token, role);
    req.vault = tokenInfo;

    return true;
  }
}