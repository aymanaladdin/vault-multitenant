export * from './vault';
export * from './interfaces';
export * from './vault.service';
export * from './login.guard';


declare global {
  namespace Express {

    interface Request {
      vault?: any;
    }
  }
}