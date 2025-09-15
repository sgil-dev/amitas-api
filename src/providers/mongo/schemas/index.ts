import { User, UserSchema } from "./user.schema";
import { Group, GroupMember, GroupMemberSchema, GroupSchema } from "./group.schema";

export const schemas = [
    { name: User.name, schema: UserSchema },    
    { name: Group.name, schema: GroupSchema },
    { name: GroupMember.name, schema: GroupMemberSchema },
]