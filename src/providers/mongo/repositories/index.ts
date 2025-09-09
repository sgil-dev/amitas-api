import { UserRepository } from "./users/user.repository.impl";

export const repositories = [
    {
        provide: 'UserRepositoryInterface',
        useClass: UserRepository,
    },
]