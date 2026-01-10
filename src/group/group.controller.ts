import { Body, Controller, Delete, ForbiddenException, Get, Inject, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { GroupInterface } from './group.interface';
import { CreateGroupDto } from './dto/request/create-group.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Group } from 'src/providers/mongo/schemas/group.schema';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { RequestWithUser } from 'src/auth/interfaces/request-with-user.interface';
import { AddMemberToGroupDto } from './dto/request/add-member.dto';
import { GroupPolicies } from './group.policies';
import { UpdateMemberDto } from './dto/request/update-member.dto';
import { PaginationResponseDto } from 'src/shared/dto/response/pagination-response.dto';
import { InvitationResponseDto } from './dto/response/invitation-response.dto';
import { InvitationQueryDto } from './dto/request/invitation-query.dto';
import { MemberStatus } from './enum/member-status.enum';
import { GroupDetailResponseDto } from './dto/response/group-detail-response.dto';
import { GroupResponseDto } from './dto/response/group-response.dto';

@Controller('groups')
export class GroupController {
    constructor(
        @Inject('GroupInterface')
        private readonly groupService: GroupInterface,
        private readonly groupPolicies: GroupPolicies,
    ) {}

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new group' })
    @ApiBody({ type: CreateGroupDto })
    @ApiResponse({ status: 201, description: 'Group created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @UseGuards(JwtAuthGuard)
    @Post()
    async createGroup(@Body() dto: CreateGroupDto, @Req() req: RequestWithUser): Promise<Group> {
        return this.groupService.createGroup(dto, req.user);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Add a member to a group' })
    @ApiBody({ type: AddMemberToGroupDto })
    @ApiResponse({ status: 201, description: 'Member added to group successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @UseGuards(JwtAuthGuard)
    @Post(':groupId/members')
    async addMemberToGroup(@Body() dto: AddMemberToGroupDto, @Param('groupId') groupId: string, @Req() req: RequestWithUser): Promise<Group> {
        const isAdmin = await this.groupPolicies.isAdmin(groupId, req.user);
        if (!isAdmin) {
            throw new ForbiddenException('No tienes permisos para agregar miembros a este grupo');
        }
        return this.groupService.addMemberToGroup(groupId, dto.email, req.user);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a member of a group' })
    @ApiBody({ type: UpdateMemberDto })
    @ApiResponse({ status: 200, description: 'Member updated successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @UseGuards(JwtAuthGuard)
    @Patch(':groupId/members/:memberId')
    async updateMember(@Body() dto: UpdateMemberDto, @Param('groupId') groupId: string, @Param('memberId') memberId: string, @Req() req: RequestWithUser): Promise<Group> {
        const canUpdate = await this.groupPolicies.canUpdateMember(groupId, req.user, memberId, dto);
        if (!canUpdate) {
            throw new ForbiddenException('No tienes permisos para actualizar miembros de este grupo');
        }
        return this.groupService.updateMember(groupId, memberId, dto, req.user);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Remove a member from a group' })
    @ApiResponse({ status: 200, description: 'Member removed from group successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @UseGuards(JwtAuthGuard)
    @Delete(':groupId/members/:memberId')
    async removeMember(@Param('groupId') groupId: string, @Param('memberId') memberId: string, @Req() req: RequestWithUser): Promise<void> {
        const canDelete = await this.groupPolicies.canDeleteMember(groupId, req.user, memberId);
        if (!canDelete) {
            throw new ForbiddenException('No tienes permisos para eliminar miembros de este grupo');
        }
        return this.groupService.removeMember(groupId, memberId);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get group invitations' })
    @ApiResponse({ status: 200, description: 'Group invitations retrieved successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiQuery({ name: 'page', type: Number, required: false })
    @ApiQuery({ name: 'limit', type: Number, required: false })
    @ApiQuery({ name: 'status', type: String, enum: MemberStatus, required: false })
    @UseGuards(JwtAuthGuard)
    @Get('invitations')
    async getGroupInvitations(@Query() query: InvitationQueryDto, @Req() req: RequestWithUser): Promise<PaginationResponseDto<InvitationResponseDto>> {
        return this.groupService.getGroupInvitations(query, req.user);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get group detail' })
    @ApiResponse({ status: 200, description: 'Group detail retrieved successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @UseGuards(JwtAuthGuard)
    @Get(':groupId')
    async getGroupDetail(@Param('groupId') groupId: string, @Req() req: RequestWithUser): Promise<GroupDetailResponseDto> {
        const isMember = await this.groupPolicies.canViewGroup(groupId, req.user);
        if (!isMember) {
            throw new ForbiddenException('No tienes permisos para ver el detalle de este grupo');
        }
        return this.groupService.getGroupDetail(groupId);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get groups' })
    @ApiResponse({ status: 200, description: 'Groups retrieved successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @UseGuards(JwtAuthGuard)
    @Get()
    async getGroupsByUserId(@Req() req: RequestWithUser): Promise<GroupResponseDto[]> {
        return this.groupService.getGroupsByUserId(req.user._id);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a group' })
    @ApiResponse({ status: 200, description: 'Group deleted successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @UseGuards(JwtAuthGuard)
    @Delete(':groupId')
    async deleteGroup(@Param('groupId') groupId: string, @Req() req: RequestWithUser): Promise<void> {
        const canDelete = await this.groupPolicies.canDeleteGroup(groupId, req.user);
        if (!canDelete) {
            throw new ForbiddenException('No tienes permisos para eliminar este grupo');
        }
        return this.groupService.deleteGroup(groupId);
    }
}

