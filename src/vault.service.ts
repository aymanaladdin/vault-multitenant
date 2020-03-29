import { IVaultOptions } from './interfaces';


export class VaultService {

  private options: IVaultOptions;
  hostname: string;

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
}