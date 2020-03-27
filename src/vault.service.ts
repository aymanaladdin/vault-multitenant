import { IVaultOptions } from './interfaces';
import request from 'request-promise-native';


export class VaultService {

  private options: IVaultOptions;
  private hostname: string;

  constructor(options?: IVaultOptions) {
    options = options || {};
    options.hostname = options.hostname || 'http://localhost:8200';
    this.options = options;
    this.hostname = this.formatHost(options.hostname);
  }

  private formatHost(hostname: string) {
    const url = new URL(hostname);

    if (url.origin === 'null') {
      throw new Error('Invalid Vault URL => ' + hostname);
    }

    return (url.href.charAt(url.href.length - 1) === '/') ? url.href.slice(0, -1) : url.href;
  }

  async login(secretEngineName: string, token: string, role: string) {
    return request({
      method: 'POST',
      uri: `${this.hostname}/v1/auth/${secretEngineName}/login`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        role,
        jwt: token
      },
      json: true
    });
  }
}