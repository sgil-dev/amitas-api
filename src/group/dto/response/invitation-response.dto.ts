import { IsNotEmpty, IsString } from "class-validator";
import { GroupResponseDto } from "./group-response.dto";
import { UserResponseDto } from "src/users/dto/response/user-response.dto";
import { MemberStatus } from "src/group/enum/member-status.enum";

export class InvitationResponseDto {
    @IsString()
    @IsNotEmpty()
    group: GroupResponseDto;

    @IsString()
    @IsNotEmpty()
    invitedBy?: UserResponseDto;

    @IsString()
    @IsNotEmpty()
    status: MemberStatus;
}
