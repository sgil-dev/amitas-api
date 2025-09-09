import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { AuthInterface } from './auth.interface';
import type { UserRepositoryInterface } from 'src/providers/mongo/repositories/users/user.repository.interface';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthUserResponseDto } from './dto/response/auth-user.response.dto';
import { AuthenticatedUser } from './interfaces/authenticated-user.interface';

@Injectable()
export class AuthService implements AuthInterface {
    constructor(
        @Inject('UserRepositoryInterface') 
        private readonly userRepository: UserRepositoryInterface,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string): Promise<AuthenticatedUser | null> {
        const user = await this.userRepository.findByEmail(email);
        
        if (!user) {
            throw new UnauthorizedException('Usuario no encontrado');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            throw new UnauthorizedException('Contraseña incorrecta');
        }

        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword as AuthenticatedUser;
    }

    async login(user: AuthenticatedUser): Promise<AuthUserResponseDto> {
        const payload = { 
            email: user.email, 
            sub: user._id,
            username: user.email,
        };

        const access_token = this.jwtService.sign(payload);

        return {
            access_token,
            user: {
                id: user._id,
                name: user.name,
                surname: user.surname,
                email: user.email,
            },
        };
    }
}
