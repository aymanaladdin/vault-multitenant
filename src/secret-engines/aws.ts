import request from 'request-promise-native';
import { VaultService } from '../vault.service';
import { IAWSGenerateTokenOptions, IAWSGenerateTokenResponse } from './interfaces';


export class AWSSecretEngine {

  private vaultService: VaultService;

  constructor(vaultService: VaultService) {
    this.vaultService = vaultService;
  }

  async generateCreds(options: IAWSGenerateTokenOptions): Promise<IAWSGenerateTokenResponse> {
    const result = await request({
      method: 'POST',
      uri: `${this.vaultService.hostname}/v1/${options.engineName}/creds/${options.roleName}`,
      headers: {
        'X-Vault-Token': options.token
      },
      json: true,
      body: {
        ttl: options.ttl || 3600,
        role_arn: options.role_arn || undefined
      }
    });

    return result.data;
  }
}