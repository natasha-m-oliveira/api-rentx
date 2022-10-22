import { ICreateUserDTO } from "../dtos/ICreateUserDTO";
import { User } from "../infra/typeorm/entities/User";

export interface IUsersRepository {
  create: (data: ICreateUserDTO) => Promise<User>;
  findByEmail: (email: string) => Promise<User>;
  findById: (id: string) => Promise<User>;
  deleteById: (id: string) => Promise<void>;
}
