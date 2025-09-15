import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { MemberStatus } from 'src/group/enum/member-status.enum';
import { User } from './user.schema';

@Schema({ _id: false })
export class GroupMember {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId | User;

  @Prop({ default: MemberStatus.INVITED, enum: MemberStatus })
  status: MemberStatus;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  invitedBy?: Types.ObjectId | User;
}

export const GroupMemberSchema = SchemaFactory.createForClass(GroupMember);
export type GroupMemberDocument = HydratedDocument<GroupMember>;

@Schema({ timestamps: true })
export class Group extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId | User;

  @Prop({ type: [GroupMember], default: [] })
  members: GroupMember[];
}

export const GroupSchema = SchemaFactory.createForClass(Group);
export type GroupDocument = HydratedDocument<Group>;