import { User } from "src/providers/mongo/schemas/user.schema";
import { CreateUserDto } from "./dto/request/create-user.dto";

export interface UsersInterface {
    createUser(dto: CreateUserDto): Promise<User>;  
}
