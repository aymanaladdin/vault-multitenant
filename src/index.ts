import { IVaultAuth } from './interfaces';
export * from './vault';
export * from './interfaces';
export * from './vault.service';
export * from './auth-engines';
export * from './secret-engines';


declare global {
  namespace Express {

    interface Request {
      vault?: IVaultAuth;
    }
  }
}
