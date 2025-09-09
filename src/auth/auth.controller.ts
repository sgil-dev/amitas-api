import { Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import type { AuthInterface } from './auth.interface';
import { LocalAuthGuard } from './guards/local-auth.guard';
import type { Request } from 'express';
import { LoginDto } from './dto/request/login.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(
        @Inject('AuthInterface') private readonly authService: AuthInterface,
    ) {}

    @ApiBody({ type: LoginDto })
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Req() req: Request) {
        return this.authService.login(req.user);
    }
}
