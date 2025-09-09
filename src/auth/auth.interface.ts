import { AuthUserResponseDto } from "./dto/response/auth-user.response.dto";

export interface AuthInterface {
    login(user: any): Promise<AuthUserResponseDto>;
    validateUser(email: string, password: string): Promise<any>;
}
