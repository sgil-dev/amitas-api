import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { UserResponseDto } from "src/users/dto/response/user-response.dto";

export class AuthUserResponseDto {  
    @ApiProperty({
        description: 'Token de acceso',
        example: '1234567890',
    })
    @IsString()
    access_token: string;

    @ApiProperty({
        description: 'Usuario',
        type: UserResponseDto,
    })
    user: UserResponseDto;
}