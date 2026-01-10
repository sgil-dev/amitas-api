import { GroupRepository } from "./groups/group.repository.impl";
import { UserRepository } from "./users/user.repository.impl";

export const repositories = [
    {
        provide: 'UserRepositoryInterface',
        useClass: UserRepository,
    },
    {
        provide: 'GroupRepositoryInterface',
        useClass: GroupRepository,
    },
]