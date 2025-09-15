import { ApiProperty } from "@nestjs/swagger";
import { MemberStatus } from "src/group/enum/member-status.enum";

export class GroupMemberResponseDto {
    @ApiProperty({ description: 'The ID of the member' })
    id: string;

    @ApiProperty({ description: 'The name of the member' })
    name: string;
    
    @ApiProperty({ description: 'The surname of the member' })
    surname?: string;

    @ApiProperty({ description: 'The email of the member' })
    email: string;

    @ApiProperty({ description: 'The status of the member' })
    status: MemberStatus;

    @ApiProperty({ description: 'The role of the member in the group' })
    isAdmin: boolean;
}