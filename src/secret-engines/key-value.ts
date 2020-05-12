import request from 'request-promise-native';
import { VaultService } from '../vault.service';
import { IKVGetSecretOptions, IKVGetSecretResponse, IKVData } from './interfaces';

export class KVSecretEngine {
  private vaultService: VaultService;

  constructor(vaultService: VaultService) {
    this.vaultService = vaultService;
  }

  async getSecret<T = IKVGetSecretResponse>(options: IKVGetSecretOptions, secretKey: string, version: number = 1): Promise<T> {
    const result = await request({
      method: 'GET',
      uri: `${this.vaultService.hostname}/v1/${options.engineName}/data/${secretKey}?version=${version}`,
      headers: {
        'X-Vault-Token': options.token
      },
      json: true
    });

    return result.data?.data;
  }

  async createSecret(options: IKVGetSecretOptions, secretKey: string, data: IKVData, cas: number = 0): Promise<void> {
    await request({
      method: 'POST',
      uri: `${this.vaultService.hostname}/v1/${options.engineName}/data/${secretKey}`,
      headers: {
        'X-Vault-Token': options.token
      },
      json: true,
      body: { data, options: { cas } }
    });
  }

  async deleteSecret(options: IKVGetSecretOptions, secretKey: string): Promise<void> {
    await request({
      method: 'DELETE',
      uri: `${this.vaultService.hostname}/v1/${options.engineName}/metadata/${secretKey}`,
      headers: {
        'X-Vault-Token': options.token
      },
      json: true
    });
  }

  async listSecretKeys(options: IKVGetSecretOptions, path?: string): Promise<string[]> {
    const result = await request({
      method: 'LIST',
      uri: `${this.vaultService.hostname}/v1/${options.engineName}/metadata/${path ? path : ''}`,
      headers: {
        'X-Vault-Token': options.token
      },
      json: true
    });

    return result.data?.keys;
  }
}
