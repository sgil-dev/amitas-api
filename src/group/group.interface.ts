import { CreateGroupDto } from './dto/request/create-group.dto';
import { Group } from 'src/providers/mongo/schemas/group.schema';
import { AuthenticatedUser } from 'src/auth/interfaces/authenticated-user.interface';
import { UpdateMemberDto } from './dto/request/update-member.dto';
import { InvitationQueryDto } from './dto/request/invitation-query.dto';
import { InvitationResponseDto } from './dto/response/invitation-response.dto';
import { PaginationResponseDto } from 'src/shared/dto/response/pagination-response.dto';
import { GroupDetailResponseDto } from './dto/response/group-detail-response.dto';
import { GroupResponseDto } from './dto/response/group-response.dto';

export interface GroupInterface {
    createGroup(dto: CreateGroupDto, payload: AuthenticatedUser): Promise<Group>;
    addMemberToGroup(groupId: string, memberEmail: string, payload: AuthenticatedUser): Promise<Group>;
    updateMember(groupId: string, memberId: string, dto: UpdateMemberDto, payload: AuthenticatedUser): Promise<Group>;
    removeMember(groupId: string, memberId: string): Promise<void>;
    getGroupInvitations(query: InvitationQueryDto, payload: AuthenticatedUser): Promise<PaginationResponseDto<InvitationResponseDto>>;
    getGroupDetail(groupId: string): Promise<GroupDetailResponseDto>;
    getGroupsByUserId(userId: string): Promise<GroupResponseDto[]>;
    deleteGroup(groupId: string): Promise<void>;
}
