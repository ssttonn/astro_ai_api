export type UserWithoutPassword<T> = Omit<T, 'password'>;

export type TokenPayload = {
  id: number;
};

export type AuthResponse = {
  accessToken: string;
  accessTokenExpiresIn: number;
  refreshToken: string;
  refreshTokenExpiresIn: number;
};

export type SuccessResponse<T> = {
  data: T;
  success: boolean;
  message: string;
  status: number;
};

export type ErrorResponse<T> = {
  error: T;
  success: boolean;
  message: string;
  status: number;
};

export interface EnvConfig {
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_REDIRECT_URI: string;
  FACEBOOK_APP_ID: string;
  FACEBOOK_APP_SECRET: string;
  FACEBOOK_REDIRECT_URI: string;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  TWITTER_CLIENT_ID: string;
  TWITTER_CLIENT_SECRET: string;
  TWITTER_REDIRECT_URI: string;
  DATABASE_URL: string;
  JWT_SECRET: string;
  [key: string]: string;
}

export interface ConfigOptions {
  folder: string | undefined;
}
