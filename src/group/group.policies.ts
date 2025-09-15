import { ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { User } from "src/providers/mongo/schemas/user.schema";
import type { GroupRepositoryInterface } from "src/providers/mongo/repositories/groups/group.repository.interface";
import { AuthenticatedUser } from "src/auth/interfaces/authenticated-user.interface";
import { UpdateMemberDto } from "./dto/request/update-member.dto";

@Injectable()
export class GroupPolicies {
    constructor(
        @Inject('GroupRepositoryInterface')
        private readonly groupRepository: GroupRepositoryInterface,
    ) {}

    async isAdmin(groupId: string, user: AuthenticatedUser): Promise<boolean> {
        const group = await this.groupRepository.findById(groupId);
        if (!group) {
            throw new NotFoundException('Grupo no encontrado');
        }
        return group.members.some(member => member.userId.toString() === user._id?.toString() && member.isAdmin);
    }

    async canUpdateMember(groupId: string, user: AuthenticatedUser, memberId: string, dto: UpdateMemberDto): Promise<boolean> {
        const group = await this.groupRepository.findById(groupId);
        if (!group) {
            throw new NotFoundException('Grupo no encontrado');
        }

        const isSelfUpdate = user._id?.toString() === memberId;
        const isAdmin = group.members.some(member => member.userId.toString() === user._id?.toString() && member.isAdmin);
        const isUpdatingAdmin = group.members.some(member => member.userId.toString() === memberId && member.isAdmin);
        const isCreator = group.createdBy.toString() === user._id?.toString();
        const isUpdatingCreator = group.createdBy.toString() === memberId;

        // Tratando de actualizar a un administrador    
        if(isUpdatingAdmin && !isSelfUpdate && !isCreator) {
            throw new ForbiddenException('No tienes permisos para actualizar a miembro administrador');
        }

        // Tratando de actualizar status
        if (dto.status && !isSelfUpdate) {
            throw new ForbiddenException('No tienes permisos para actualizar el status de este miembro');
        } 

        // Tratando de actualizar isAdmin
        if(dto.isAdmin || dto.isAdmin === false && !isAdmin) {
            throw new ForbiddenException('No tienes permisos para actualizar el rol de este miembro en el grupo');
        } 

        // Tratando de actualizar admin false en creador
        if('isAdmin' in dto && dto.isAdmin === false && isCreator && isUpdatingCreator) {
            throw new ForbiddenException('No es posible quitar la administración al creador del grupo');
        }

        return true;
    }

    async canDeleteMember(groupId: string, user: AuthenticatedUser, memberId: string): Promise<boolean> {
        const group = await this.groupRepository.findById(groupId);
        if (!group) {
            throw new NotFoundException('Grupo no encontrado');
        }

        const deletedMember = group.members.find(member => member.userId.toString() === memberId);
        if (!deletedMember) {
            throw new NotFoundException('Miembro no encontrado en el grupo');
        } 

        const isAdmin = group.members.some(member => member.userId.toString() === user._id?.toString() && member.isAdmin);
        const isSelfDelete = user._id?.toString() === memberId;

        const deletedIsAdmin = deletedMember.isAdmin;

        if ((!isAdmin && !isSelfDelete) || (deletedIsAdmin && !isSelfDelete)) {
            throw new ForbiddenException('No tienes permisos para eliminar este miembro del grupo');
        }

        return true;
    }

    async canViewGroup(groupId: string, user: AuthenticatedUser): Promise<boolean> {
        const group = await this.groupRepository.findById(groupId);
        if (!group) {
            throw new NotFoundException('Grupo no encontrado');
        }
        return group.members.some(member => member.userId._id?.toString() === user._id?.toString());
    }

    async canDeleteGroup(groupId: string, user: AuthenticatedUser): Promise<boolean> {
        const group = await this.groupRepository.findById(groupId);
        if (!group) {
            throw new NotFoundException('Grupo no encontrado');
        }

        return group.createdBy._id?.toString() === user._id?.toString();
    }
}