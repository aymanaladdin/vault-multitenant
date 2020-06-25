import request from 'request-promise-native';
import { VaultService } from '../vault.service';
import { IKVGetSecretOptions, IKVGetSecretResponse, IKVData, KvEngineVersion } from './interfaces';

export class KVSecretEngine {
  private vaultService: VaultService;

  constructor(vaultService: VaultService) {
    this.vaultService = vaultService;
  }

  async getSecret<T = IKVGetSecretResponse>(options: IKVGetSecretOptions, secretKey: string, version: number = 1): Promise<T> {
    const baseUri = `${this.vaultService.hostname}/v1/${options.engineName}`;
    const uri = (options.engineVersion === KvEngineVersion.v1) ?
      `${baseUri}/${secretKey}` : `${baseUri}/data/${secretKey}?version=${version}`;

    const result = await request({
      method: 'GET',
      uri,
      headers: {
        'X-Vault-Token': options.token
      },
      json: true
    });

    return (options.engineVersion === KvEngineVersion.v1) ? result.data : result.data?.data;
  }

  async createSecret(options: IKVGetSecretOptions, secretKey: string, data: IKVData, cas: number = 0): Promise<void> {
    const baseUri = `${this.vaultService.hostname}/v1/${options.engineName}`;
    const uri = (options.engineVersion === KvEngineVersion.v1) ? `${baseUri}/${secretKey}` : `${baseUri}/data/${secretKey}`;

    const body = (options.engineVersion === KvEngineVersion.v1) ? data : { data, options: { cas } };

    await request({
      method: 'POST',
      uri,
      headers: {
        'X-Vault-Token': options.token
      },
      json: true,
      body
    });
  }

  async deleteSecret(options: IKVGetSecretOptions, secretKey: string): Promise<void> {
    const baseUri = `${this.vaultService.hostname}/v1/${options.engineName}`;
    const uri = (options.engineVersion === KvEngineVersion.v1) ? `${baseUri}/${secretKey}` : `${baseUri}/metadata/${secretKey}`;

    await request({
      method: 'DELETE',
      uri,
      headers: {
        'X-Vault-Token': options.token
      },
      json: true
    });
  }

  async listSecretKeys(options: IKVGetSecretOptions, path?: string): Promise<string[]> {
    const baseUri = `${this.vaultService.hostname}/v1/${options.engineName}`;
    const uri = (options.engineVersion === KvEngineVersion.v1) ? `${baseUri}/${path}` : `${baseUri}/metadata/${path}`;

    const result = await request({
      method: 'LIST',
      uri,
      headers: {
        'X-Vault-Token': options.token
      },
      json: true
    });

    return result.data?.keys;
  }
}
