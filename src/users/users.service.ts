import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UsersInterface } from './users.interface';
import type { UserRepositoryInterface } from 'src/providers/mongo/repositories/users/user.repository.interface';
import { User } from 'src/providers/mongo/schemas/user.schema';
import { CreateUserDto } from './dto/request/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements UsersInterface {
    constructor(
        @Inject('UserRepositoryInterface')
        private readonly userRepository: UserRepositoryInterface,
    ) {}

    async createUser(dto: CreateUserDto): Promise<User> {
        // Email unico
        const user = await this.userRepository.findByEmail(dto.email);
        if (user) {
            throw new BadRequestException('El email ya está registrado');
        }

        // Hasho password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(dto.password, saltRounds);
        dto.password = hashedPassword;

        return this.userRepository.create(dto);
    }
}
