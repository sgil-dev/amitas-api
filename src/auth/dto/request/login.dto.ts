import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class LoginDto {
    @ApiProperty({
        description: 'Email del usuario',
        example: 'j.carnivale@example.com',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Contraseña del usuario',
        example: 'password',
    })
    @IsString()
    @MinLength(8)
    password: string;
}