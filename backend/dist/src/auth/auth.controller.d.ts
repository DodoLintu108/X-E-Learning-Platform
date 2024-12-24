import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: {
        name: string;
        email: string;
        password: string;
        role: string;
    }): Promise<any>;
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        accessToken: string;
        role: any;
    }>;
}
