import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from './dto/request/create-user.dto';
import { Inject } from '@nestjs/common';
import type { UsersInterface } from './users.interface';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
    constructor(
        @Inject('UsersInterface')
        private readonly usersService: UsersInterface,
    ) {}

    @ApiOperation({ summary: 'Create a user' })
    @ApiBody({ type: CreateUserDto })
    @Post()
    async createUser(@Body() createUserDto: CreateUserDto) {
        return this.usersService.createUser(createUserDto);
    }
}
