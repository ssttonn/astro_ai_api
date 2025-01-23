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
