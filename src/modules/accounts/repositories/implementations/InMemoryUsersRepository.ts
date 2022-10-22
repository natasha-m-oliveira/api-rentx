import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { User } from "@modules/accounts/infra/typeorm/entities/User";

import { IUsersRepository } from "../IUsersRepository";

export class InMemoryUsersRepository implements IUsersRepository {
  private readonly users: User[];

  constructor() {
    this.users = [];
  }

  async create({
    name,
    email,
    password,
    driver_license,
    avatar,
    id,
  }: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, {
      name,
      email,
      password,
      driver_license,
      avatar,
    });

    if (id) {
      user.id = id;
      const index = this.users.findIndex(({ id }) => user.id === id);
      const userAlreadyExists = index > -1;

      if (userAlreadyExists) {
        this.users[index] = user;
      } else {
        this.users.push(user);
      }
    } else {
      this.users.push(user);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = this.users.find((user) => user.email === email);
    return user;
  }

  async findById(id: string): Promise<User> {
    const user = this.users.find((user) => user.id === id);
    return user;
  }

  async deleteById(id: string): Promise<void> {
    const index = this.users.findIndex((user) => user.id === id);
    if (index > -1) {
      this.users.splice(index, 1);
    }
  }
}
