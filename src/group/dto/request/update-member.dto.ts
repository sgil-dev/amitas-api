import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { MemberStatus } from 'src/group/enum/member-status.enum';


export class UpdateMemberDto {
    @ApiProperty({
        description: 'Nuevo estatus del miembro',
        enum: MemberStatus,
        required: false,
        example: MemberStatus.JOINED
    })
    @IsOptional()
    @IsEnum(MemberStatus)
    status?: MemberStatus;

    @ApiProperty({
        description: 'Si el miembro es administrador',
        required: false,
        example: true
    })
    @IsOptional()
    @IsBoolean()
    isAdmin?: boolean;
}