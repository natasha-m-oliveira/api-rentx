export interface IPayload {
  sub: string;
  email?: string;
}

export interface IOptions {
  ignoreExpiration: boolean;
}

export interface ITokenProvider {
  generateAccessToken: (user_id: string) => string;
  generateRefreshToken: (user_id: string, email: string) => string;
  validateToken: (
    token: string,
    secret: string,
    options?: IOptions
  ) => IPayload;
}
