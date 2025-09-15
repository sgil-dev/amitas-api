import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

@Schema()
export class User {
    _id?: Types.ObjectId;
    
    @Prop({ required: true })
    name: string;

    @Prop({ required: false })
    surname?: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = HydratedDocument<User>;