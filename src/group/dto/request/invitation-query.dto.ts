import { MemberStatus } from "src/group/enum/member-status.enum";
import { IsOptional, IsString, IsNotEmpty, IsEnum } from "class-validator";
import { PaginationDto } from "src/shared/dto/request/pagination.dto";

export class InvitationQueryDto extends PaginationDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @IsEnum(MemberStatus)
    status?: MemberStatus;
}