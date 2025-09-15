import { User } from "src/providers/mongo/schemas/user.schema";

export interface UserRepositoryInterface {
    findAll(): Promise<User[]>;
    create(user: User): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
}