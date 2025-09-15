import { ApiProperty } from '@nestjs/swagger';
import { GroupMemberResponseDto } from './group-member.response.dto';

export class GroupDetailResponseDto {
    @ApiProperty({
        description: 'The ID of the group',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    id: string;

    @ApiProperty({
        description: 'The name of the group',
        example: 'Group 1',
    })
    name: string;

    @ApiProperty({
        description: 'The description of the group',
        example: 'Group 1 description',
        required: false,
    })
    description?: string;

    @ApiProperty({
        description: 'The members of the group',
        type: [GroupMemberResponseDto],
    })
    members: GroupMemberResponseDto[];

}