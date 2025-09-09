import { IsString, IsNotEmpty, IsOptional, IsEmail, Matches, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({
        description: 'The name of the user',
        example: 'Johnny',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'The surname of the user',
        example: 'Carnivale',
        required: false,
    })
    @IsString()
    @IsOptional()
    surname: string;

    @ApiProperty({
        description: 'The password of the user',
        example: 'password',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(128)
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]/,
        {
            message: 'La contraseña debe contener al menos: 1 letra minúscula, 1 letra mayúscula, 1 número y 1 carácter especial (@$!%*?&.)'
        }
    )
    password: string;

    @ApiProperty({
        description: 'The email of the user',
        example: 'j.carnivale@example.com',
        required: true,
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;
}