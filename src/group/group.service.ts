import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import type { GroupInterface } from './group.interface';
import type { GroupRepositoryInterface } from 'src/providers/mongo/repositories/groups/group.repository.interface';
import { CreateGroupDto } from './dto/request/create-group.dto';
import { Group, GroupMember } from 'src/providers/mongo/schemas/group.schema';
import { AuthenticatedUser } from 'src/auth/interfaces/authenticated-user.interface';
import { Types } from 'mongoose';
import { MemberStatus } from './enum/member-status.enum';
import type { UserRepositoryInterface } from 'src/providers/mongo/repositories/users/user.repository.interface';
import { UpdateMemberDto } from './dto/request/update-member.dto';
import { InvitationResponseDto } from './dto/response/invitation-response.dto';
import { formatUserResponse } from 'src/shared/formatters/user.formatter';
import { User } from 'src/providers/mongo/schemas/user.schema';
import { GroupResponseDto } from './dto/response/group-response.dto';
import { InvitationQueryDto } from './dto/request/invitation-query.dto';
import { PaginationResponseDto } from 'src/shared/dto/response/pagination-response.dto';
import { GroupDetailResponseDto } from './dto/response/group-detail-response.dto';
import { GroupMemberResponseDto } from './dto/response/group-member.response.dto';

@Injectable()
export class GroupService implements GroupInterface {
    constructor(
        @Inject('GroupRepositoryInterface')
        private readonly groupRepository: GroupRepositoryInterface,
        @Inject('UserRepositoryInterface')
        private readonly userRepository: UserRepositoryInterface,
    ) {}

    async createGroup(dto: CreateGroupDto, payload: AuthenticatedUser): Promise<Group> {
        const createdBy = new Types.ObjectId(payload._id);
        const initialMember = {
            userId: createdBy,
            status: MemberStatus.JOINED,
            isAdmin: true,
        } as GroupMember;

        const group = { ...dto, createdBy, members: [initialMember] } as Group;
        return this.groupRepository.create(group);
    }

    async addMemberToGroup(groupId: string, memberEmail: string, payload: AuthenticatedUser): Promise<Group> {
        const group = await this.groupRepository.findById(groupId);
        if (!group) {
            throw new NotFoundException('Grupo no encontrado al agregar miembro');
        }
        const invitedUser = await this.userRepository.findByEmail(memberEmail);
        if (!invitedUser) {
            throw new NotFoundException('El miembro que trata de agregar no existe');
        }

        if(group.members.some(member => member.userId.toString() === invitedUser._id?.toString())) {
            throw new BadRequestException('El miembro ya existe en el grupo');
        }
        
        const newMember = {
            userId: invitedUser._id,
            status: MemberStatus.INVITED,
            isAdmin: false,
            invitedBy: new Types.ObjectId(payload._id),
        } as GroupMember;
        
        const updatedGroup = await this.groupRepository.addMember(groupId, newMember);
        if (!updatedGroup) {
            throw new InternalServerErrorException('Error al agregar miembro al grupo');
        }
        
        return updatedGroup;
    }

    async updateMember(groupId: string, memberId: string, dto: UpdateMemberDto): Promise<Group> {
        const group = await this.groupRepository.findById(groupId);
        if (!group) {
            throw new NotFoundException('Grupo no encontrado al actualizar miembro');
        }

        const existingInGroup = group.members.find(member => member.userId.toString() === memberId);
        if (!existingInGroup) {
            throw new NotFoundException('Miembro no encontrado en el grupo');
        }

        const userMember = await this.userRepository.findById(memberId);
        if (!userMember) {
            throw new NotFoundException('Miembro no encontrado');
        }

        if (dto.status) {
            this.validateStatusTransition(existingInGroup.status, dto.status);
            existingInGroup.status = dto.status;
        }

        if (dto.isAdmin) {
            existingInGroup.isAdmin = dto.isAdmin;
        }
        
        const updatedMember = { ...existingInGroup, ...dto } as GroupMember;
        const updatedGroup = await this.groupRepository.updateMember(groupId, memberId, updatedMember);
        
        if (!updatedGroup) {
            throw new InternalServerErrorException('Error al actualizar miembro en el grupo');
        }
        return updatedGroup;
    }

    async removeMember(groupId: string, memberId: string): Promise<void> {
        const group = await this.groupRepository.findById(groupId);
        if (!group) {
            throw new NotFoundException('Grupo no encontrado al eliminar miembro');
        }
        await this.groupRepository.removeMember(groupId, memberId);
    }

    async getGroupInvitations(query: InvitationQueryDto, payload: AuthenticatedUser): Promise<PaginationResponseDto<InvitationResponseDto>> {
        const invitationsFromDb = await this.groupRepository.findGroupInvitationsByUserId(payload._id, query);
        const data =  invitationsFromDb.data.map(invitation => this.formatInvitation(invitation, payload._id));
        return { data, pagination: invitationsFromDb.pagination };
    }

    async getGroupsByUserId(userId: string): Promise<GroupResponseDto[]> {
        const groups = await this.groupRepository.findByUserId(userId);
        return groups.map(group => this.formatGroupResponse(group));
    }

    async getGroupDetail(groupId: string): Promise<GroupDetailResponseDto> {
        const group = await this.groupRepository.findById(groupId);
        if (!group) {
            throw new NotFoundException('Grupo no encontrado');
        }
        return this.formatGroupDetailResponse(group);
    }

    async deleteGroup(groupId: string): Promise<void> {
        await this.groupRepository.delete(groupId);
    }

    validateStatusTransition(oldStatus: MemberStatus, newStatus: MemberStatus): void {
        if(oldStatus === newStatus) {
            throw new BadRequestException('No es posible cambiar el estado de un miembro a su mismo estado');
        }

        if(newStatus === MemberStatus.INVITED) {
            throw new BadRequestException('No es posible cambiar el estado de un miembro a invitado');
        }
    }

    formatInvitation(invitation: Group, userId: string): InvitationResponseDto {
        const invitedMember = invitation.members.find(member => member.userId.toString() === userId);
        const invitedByUser = invitedMember?.invitedBy && typeof invitedMember.invitedBy === 'object' ? invitedMember.invitedBy as User : null;

        return{
            group: this.formatGroupResponse(invitation),
            invitedBy: invitedByUser ? formatUserResponse(invitedByUser) : undefined,
            status: invitedMember?.status ?? MemberStatus.INVITED,
        };
    }

    formatGroupResponse(group: Group): GroupResponseDto {
        return {
            id: group._id?.toString() ?? '',
            name: group.name,
            description: group.description
        };
    }

    formatGroupDetailResponse(group: Group): GroupDetailResponseDto {
        return {
            id: group._id?.toString() ?? '',
            name: group.name,
            description: group.description,
            members: group.members.map(member => this.formatMemberResponse(member)),
        };
    }

    formatMemberResponse(member: GroupMember): GroupMemberResponseDto {
        const user =  member.userId as User;

        return {
            id: member.userId._id?.toString() ?? '',
            name: user?.name ?? '',
            email: user?.email ?? '',
            status: member.status,
            isAdmin: member.isAdmin,
        };
    }

}
