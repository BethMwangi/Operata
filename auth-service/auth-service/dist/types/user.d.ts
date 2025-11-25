export interface JwtPayload {
    sub: string;
    phone: string;
    email: string;
    iat?: number;
    exp?: number;
}
