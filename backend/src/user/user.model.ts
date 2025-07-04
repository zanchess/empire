import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ID, ObjectType, Int } from '@nestjs/graphql';

export type UserDocument = User & Document;

@ObjectType()
@Schema()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  @Prop({ required: true, unique: true })
  email: string;

  @Field()
  @Prop({ required: true })
  name: string;
}

@ObjectType()
export class UsersPagination {
  @Field(() => [User])
  users: User[];

  @Field(() => Int)
  totalCount: number;

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  currentPage: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
