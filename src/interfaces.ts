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