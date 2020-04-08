import request from 'request-promise-native';
import { VaultService } from '../vault.service';
import { IKVGetSecretsOptions, IKVGetSecretsResponse } from './interfaces';

export class KVSecretEngine {
  private vaultService: VaultService;

  constructor(vaultService: VaultService) {
    this.vaultService = vaultService;
  }

  async generateCreds(options: IKVGetSecretsOptions): Promise<IKVGetSecretsResponse> {
    const result = await request({
      method: 'GET',
      uri: `${this.vaultService.hostname}/v1/${options.path}`,
      headers: {
        'X-Vault-Token': options.token
      },
      json: true,
      body: {}
    });

    return result.data;
  }
}
