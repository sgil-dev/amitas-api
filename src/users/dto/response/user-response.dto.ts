import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class UserResponseDto {
    @ApiProperty({
        description: 'ID del usuario',
        example: '1234567890',
    })
    @IsString()
    id: string;

    @ApiProperty({
        description: 'Email del usuario',
        example: 'test@test.com',
    })
    @IsEmail()
    email: string;
    
    @ApiProperty({
        description: 'Nombre del usuario',
        example: 'John',
    })
    @IsString()
    name: string;
    
    @ApiProperty({
        description: 'Apellido del usuario',
        example: 'Doe',
    })
    @IsString()
    surname?: string;
}