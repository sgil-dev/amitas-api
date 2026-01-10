import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Group, GroupDocument } from '../../schemas/group.schema';
import { GroupRepositoryInterface } from './group.repository.interface';
import { GroupMember } from '../../schemas/group.schema';
import { MemberStatus } from 'src/group/enum/member-status.enum';
import { InvitationQueryDto } from 'src/group/dto/request/invitation-query.dto';
import { PaginationResponseDto } from 'src/shared/dto/response/pagination-response.dto';

@Injectable()
export class GroupRepository implements GroupRepositoryInterface {
    constructor(
        @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
    ) {}

    async create(group: Group): Promise<Group> {
        return this.groupModel.create(group);
    }

    async findById(id: string): Promise<Group | null> {
        return this.groupModel.findById(id)
            .populate('members.userId', 'name surname email')
            .populate('createdBy', 'name surname email')
            .lean();
    }

    async findByUserId(userId: string): Promise<Group[]> {
        return this.groupModel.find({ members: { $elemMatch: { userId: new Types.ObjectId(userId) } } }).lean();
    }

    async update(id: string, group: Group): Promise<Group | null> {
        return this.groupModel.findByIdAndUpdate(id, group, { new: true }).lean();
    }

    async addMember(id: string, member: GroupMember): Promise<Group | null> {
        return this.groupModel.findByIdAndUpdate(
            id, 
            { $push: { members: member } }, 
            { new: true }
        ).lean();
    }

    async removeMember(id: string, userId: string): Promise<Group | null> {
        return this.groupModel.findByIdAndUpdate(
            id, 
            { $pull: { members: { userId: new Types.ObjectId(userId) } } }, 
            { new: true }
        ).lean();
    }

    async updateMember(id: string, userId: string, member: GroupMember): Promise<Group | null> {
        return this.groupModel.findOneAndUpdate(
            { 
                _id: id, 
                'members.userId': new Types.ObjectId(userId) 
            },
            { 
                $set: { 
                    'members.$.status': member.status, 
                    'members.$.isAdmin': member.isAdmin 
                } 
            },
            { new: true }
        ).lean();
    }

    async delete(id: string): Promise<void> {
        await this.groupModel.findByIdAndDelete(id);
    }

    async findGroupsByUserId(userId: string): Promise<Group[]> {
        return this.groupModel
            .find({ members: { $elemMatch: { userId: new Types.ObjectId(userId) } } })
            .populate('members.userId', 'name surname email')
            .populate('createdBy', 'name surname email')
            .lean();
    }

    async findGroupInvitationsByUserId(userId: string, query: InvitationQueryDto): Promise<PaginationResponseDto<Group>> {
        const baseQuery = { 
            members: { 
                $elemMatch: { 
                    userId: new Types.ObjectId(userId), 
                    status: query.status ?? MemberStatus.INVITED 
                } 
            } 
        };
    
        const total = await this.groupModel.countDocuments(baseQuery);
    
        const qb = this.groupModel
            .find(baseQuery)
            .populate('members.userId', 'name surname email')
            .populate('createdBy', 'name surname email')
            .populate('members.invitedBy', 'name surname email');
    
        if (query.page !== undefined && query.limit !== undefined) {
            qb.skip(query.page * query.limit).limit(query.limit);
        }
    
        const data = await qb.lean();
    
        return { data, pagination: { total, page: query.page, limit: query.limit } };
    }
}