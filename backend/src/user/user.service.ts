import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserInput, UpdateUserInput, UsersFilterInput } from './user.schema';
import { User, UsersPagination } from './user.model';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUser(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new Error('User not found');

    return user;
  }

  async getUsers(page = 1, limit = 10, filter?: UsersFilterInput): Promise<UsersPagination> {
    const [users, totalCount] = await Promise.all([
      this.userRepository.findAll(page, limit, filter),
      this.userRepository.countAll(filter),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      users,
      totalCount,
      totalPages,
      currentPage: page,
    };
  }

  async createUser(input: CreateUserInput): Promise<User> {
    return this.userRepository.create(input);
  }

  async updateUser(id: string, input: UpdateUserInput): Promise<User> {
    const user = await this.userRepository.update(id, input);
    if (!user) throw new Error('User not found');

    return user;
  }

  async deleteUser(id: string): Promise<User> {
    const user = await this.userRepository.delete(id);
    if (!user) throw new Error('User not found');

    return user;
  }
}
