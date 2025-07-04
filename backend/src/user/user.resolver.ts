import { Resolver, Query, Args, Mutation, ID, Int } from '@nestjs/graphql';
import { User, UsersPagination } from './user.model';
import { UserService } from './user.service';
import { CreateUserInput, UpdateUserInput, UsersFilterInput } from './user.schema';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  user(@Args('id', { type: () => ID }) id: string) {
    return this.userService.getUser(id);
  }

  @Query(() => UsersPagination)
  users(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
    @Args('filter', { nullable: true }) filter?: UsersFilterInput,
  ) {
    return this.userService.getUsers(page, limit, filter);
  }

  @Mutation(() => User)
  createUser(@Args('input') input: CreateUserInput) {
    return this.userService.createUser(input);
  }

  @Mutation(() => User)
  updateUser(@Args('id', { type: () => ID }) id: string, @Args('input') input: UpdateUserInput) {
    return this.userService.updateUser(id, input);
  }

  @Mutation(() => User)
  deleteUser(@Args('id', { type: () => ID }) id: string) {
    return this.userService.deleteUser(id);
  }
}
