import { ICreateUserTokenDTO } from "../dtos/ICreateUserTokenDTO";
import { UserToken } from "../infra/typeorm/entities/UserToken";

export interface IUsersTokensRepository {
  create: (data: ICreateUserTokenDTO) => Promise<UserToken>;
  findByUserAndRefreshToken: (
    user_id: string,
    refresh_token: string
  ) => Promise<UserToken>;
  findLastTokenByUser: (user_id: string) => Promise<UserToken>;
  findByRefreshToken: (refresh_token: string) => Promise<UserToken>;
  deleteById: (id: string) => Promise<void>;
  deleteByUser: (user_id: string) => Promise<void>;
}
