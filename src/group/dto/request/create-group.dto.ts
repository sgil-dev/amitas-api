import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateGroupDto {
    @ApiProperty({
        description: 'The name of the group',
        example: 'Group 1',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'The description of the group',
        example: 'Group 1 description',
    })
    @IsString()
    @IsOptional()
    description?: string;
}