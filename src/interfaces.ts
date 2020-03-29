import { Request } from 'express';


export interface IVaultOptions {
  hostname?: string;
}

export interface IVaultExtOptions {
  vaultOptions?: IVaultOptions;
  errorHandling?: IVaultErrorHandler;
  getAuthInfo?: IVaultAuthInfoParser;
}

export interface IVaultErrorHandler {
  (error: Error): any;
}

export interface IVaultAuthInfo {
  token: string;
  authEngineName: string;
}

export interface IVaultAuthInfoParser {
  (req: Request): IVaultAuthInfo;
}

export interface IVaultAuth {
  client_token: string;
  accessor: string;
  policies: string[];
  token_policies: string[];
  metadata: {
    role: string;
    [key: string]: string;
  };
  lease_duration: number;
  renewable: boolean;
  entity_id: string;
  token_type: string;
  orphan: boolean;
}