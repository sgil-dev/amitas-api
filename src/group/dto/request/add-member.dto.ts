import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class AddMemberToGroupDto {
    @ApiProperty({
        description: 'Email del miembro a agregar',
        example: 'j.carnivale@example.com',
    })
    @IsEmail()
    email: string;
}