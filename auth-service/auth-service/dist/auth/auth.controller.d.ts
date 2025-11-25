import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        id: string;
        phone: string;
        email: string;
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
    }>;
    validate(authHeader?: string): Promise<{
        valid: boolean;
        payload?: undefined;
    } | {
        valid: boolean;
        payload: import("../types/user").JwtPayload;
    }>;
}
