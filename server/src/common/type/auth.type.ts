export type JwtAccessTokenPayloadType = {
  id: string;
  email: string;
  role: string;
  exp: number;
};

export type JwtRefreshTokenPayloadType = {
  id: string;
  exp: number;
};

export type CookiePayloadType = {
  accessToken: string;
  refreshToken: string;
};
