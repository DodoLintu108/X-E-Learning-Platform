import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(userData: {
        name: string;
        email: string;
        password: string;
        role: string;
    }): Promise<import("../users/users.entity").User>;
    login(email: string, password: string): Promise<{
        accessToken: string;
        role: string;
        user: import("../users/users.entity").User;
    }>;
}
