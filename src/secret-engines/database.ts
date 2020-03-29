import request from 'request-promise-native';
import { VaultService } from '../vault.service';
import { IDBGenerateTokenOptions, IDBGenerateTokenResponse } from './interfaces';


export class DBSecretEngine {

  private vaultService: VaultService;

  constructor(vaultService: VaultService) {
    this.vaultService = vaultService;
  }

  async generateCreds(options: IDBGenerateTokenOptions): Promise<IDBGenerateTokenResponse> {
    const result = await request({
      method: 'GET',
      uri: `${this.vaultService.hostname}/v1/${options.engineName}/creds/${options.roleName}`,
      headers: {
        'X-Vault-Token': options.token
      },
      json: true,
      body: {}
    });

    return result.data;
  }
}