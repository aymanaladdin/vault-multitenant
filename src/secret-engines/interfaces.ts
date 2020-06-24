import { DBSecretEngine } from './database';
import { AWSSecretEngine } from './aws';
import { KVSecretEngine } from './key-value';

export interface IAWSGenerateTokenOptions {
  engineName: string;
  token: string;
  roleName: string;
  ttl?: string;
  role_arn?: string;
}

export interface IAWSGenerateTokenResponse {
  access_key: string;
  secret_key: string;
  security_token: any;
}

export interface IDBGenerateTokenOptions {
  engineName: string;
  token: string;
  roleName: string;
}

export interface IDBGenerateTokenResponse {
  username: string;
  password: string;
}

export interface IKVGetSecretOptions {
  engineName: string;
  token: string;
}

export interface IKVGetSecretResponse {
  [key: string]: string;
}

export interface IKVData {
  [key: string]: any;
}

export interface ICachingUtilsOptions {
  awsSecretEngine: AWSSecretEngine;
  dbSecretEngine: DBSecretEngine;
  kvSecretEngine: KVSecretEngine;
}

export interface IAWSGetTokenOptions extends IAWSGenerateTokenOptions {
  cacheEngineName: string;
  cachePath: string;
  cachettl: number;
}

export interface IDBGetTokenOptions extends IDBGenerateTokenOptions {
  cacheEngineName: string;
  cachePath: string;
  cachettl: number;
}

export interface ICachedCreds {
  exp: number;
  data: any;
}