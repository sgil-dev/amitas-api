import { Group, GroupMember } from '../../schemas/group.schema';
import { InvitationQueryDto } from 'src/group/dto/request/invitation-query.dto';
import { PaginationResponseDto } from 'src/shared/dto/response/pagination-response.dto';

export interface GroupRepositoryInterface {
    create(group: Group): Promise<Group>;
    findById(id: string): Promise<Group | null>;
    findByUserId(userId: string): Promise<Group[]>;
    update(id: string, group: Group): Promise<Group | null>;
    addMember(id: string, member: GroupMember): Promise<Group | null>;
    removeMember(id: string, userId: string): Promise<Group | null>;
    updateMember(id: string, userId: string, member: GroupMember): Promise<Group | null>;
    delete(id: string): Promise<void>;
    findGroupsByUserId(userId: string, groupFilters): Promise<Group[]>;
    findGroupInvitationsByUserId(userId: string, query: InvitationQueryDto): Promise<PaginationResponseDto<Group>>;
}