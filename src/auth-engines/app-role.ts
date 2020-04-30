import request from 'request-promise-native';
import { VaultService } from '../vault.service';

export class AppRoleAuthEngine {
  private vaultService: VaultService;

  constructor(vaultService: VaultService) {
    this.vaultService = vaultService;
  }

  async login(secretEngineName: string, secretId: string, roleId: string) {
    return request({
      method: 'POST',
      uri: `${this.vaultService.hostname}/v1/auth/${secretEngineName}/login`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        role_id: roleId,
        secret_id: secretId
      },
      json: true
    });
  }
}
