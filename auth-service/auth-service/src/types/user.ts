export interface JwtPayload {
  sub: string; // user id
  phone: string;
  email: string;
  iat?: number;
  exp?: number;
}
