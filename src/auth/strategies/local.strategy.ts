import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import type { AuthInterface } from "../auth.interface";
import { Inject, UnauthorizedException } from "@nestjs/common";
import { AuthenticatedUser } from "../interfaces/authenticated-user.interface";

export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject('AuthInterface') private readonly authService: AuthInterface,
    ) {
        super({
            usernameField: 'email',
            passwordField: 'password',
        });
    }

    async validate(email: string, password: string): Promise<AuthenticatedUser> {
        const user = await this.authService.validateUser(email, password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return user;
    }
}