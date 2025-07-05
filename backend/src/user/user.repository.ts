import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery } from 'mongoose';
import { User, UserDocument } from './user.model';
import { CreateUserInput, UpdateUserInput, UsersFilterInput } from './user.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async findAll(page = 1, limit = 10, filter?: UsersFilterInput): Promise<User[]> {
    const query: RootFilterQuery<UserDocument> = {};

    if (filter?.search) {
      query.$or = [
        { email: { $regex: filter.search, $options: 'i' } },
        { name: { $regex: filter.search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    return this.userModel.find(query).skip(skip).limit(limit).exec();
  }

  async countAll(filter?: UsersFilterInput): Promise<number> {
    const query: RootFilterQuery<UserDocument> = {};

    if (filter?.search) {
      query.$or = [
        { email: { $regex: filter.search, $options: 'i' } },
        { name: { $regex: filter.search, $options: 'i' } },
      ];
    }

    return this.userModel.countDocuments(query).exec();
  }

  async create(input: CreateUserInput): Promise<User> {
    const created = new this.userModel(input);
    return created.save();
  }

  async update(id: string, input: UpdateUserInput): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(id, input, { new: true }).exec();
  }

  async delete(id: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
