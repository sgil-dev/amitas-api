import { User, UserDocument } from "src/providers/mongo/schemas/user.schema";
import { UserRepositoryInterface } from "./user.repository.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

export class UserRepository implements UserRepositoryInterface {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async create(user: User): Promise<User> {
        return this.userModel.create(user);
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find().lean();
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ email }).lean();
    }
}