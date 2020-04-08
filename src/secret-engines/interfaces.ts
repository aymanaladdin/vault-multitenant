export interface IAWSGenerateTokenOptions {
  engineName: string;
  token: string;
  roleName: string;
  ttl?: number;
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

export interface IKVGetSecretsOptions {
  path: string;
  token: string;
}

export interface IKVGetSecretsResponse {
  [key: string]: string;
}
