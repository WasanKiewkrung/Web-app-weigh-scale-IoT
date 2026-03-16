import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose'; // ✅ เพิ่ม Types

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string; // เก็บ hashed password
}

// เพิ่ม _id type 
export type UserDocument = Document & {
  _id: Types.ObjectId;
} & User;

export const UserSchema = SchemaFactory.createForClass(User);
