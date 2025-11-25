import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from '../types/user';
export declare class AuthService {
    private readonly usersRepo;
    private readonly jwtService;
    constructor(usersRepo: Repository<User>, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        id: string;
        phone: string;
        email: string;
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
    }>;
    validateToken(token: string): Promise<JwtPayload>;
}
