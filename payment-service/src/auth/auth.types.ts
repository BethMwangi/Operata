export interface AuthValidationResponse {
  valid: boolean;
  payload?: {
    sub: string;
    phone: string;
    email: string;
    iat: number;
    exp: number;
    [key: string]: any;
  };
}
