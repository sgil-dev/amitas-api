import { ApiProperty } from "@nestjs/swagger";

export class GroupResponseDto {
    @ApiProperty({ description: 'The ID of the group' })
    id: string;

    @ApiProperty({ description: 'The name of the group' })
    name: string;

    @ApiProperty({ description: 'The description of the group' })
    description?: string;
}