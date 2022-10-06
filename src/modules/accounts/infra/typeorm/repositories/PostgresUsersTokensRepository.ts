import { getRepository, Repository } from "typeorm";

import { ICreateUserTokenDTO } from "@modules/accounts/dtos/ICreateUserTokenDTO";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";

import { UserToken } from "../entities/UserToken";

export class PostgresUsersTokensRepository implements IUsersTokensRepository {
  private readonly repository: Repository<UserToken>;

  constructor() {
    this.repository = getRepository(UserToken);
  }

  async create({
    user_id,
    refresh_token,
    expires_date,
  }: ICreateUserTokenDTO): Promise<UserToken> {
    const userToken = this.repository.create({
      user_id,
      refresh_token,
      expires_date,
    });

    await this.repository.save(userToken);
    return userToken;
  }

  async findByUserAndRefreshToken(
    user_id: string,
    refresh_token: string
  ): Promise<UserToken> {
    const userToken = await this.repository.findOne({
      where: {
        user_id,
        refresh_token,
      },
    });
    return userToken;
  }

  async findLastTokenByUser(user_id: string): Promise<UserToken> {
    const userToken = await this.repository.findOne({
      where: { user_id },
      order: { created_at: "DESC" },
    });
    return userToken;
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async deleteByUser(user_id: string): Promise<void> {
    await this.repository.delete({
      user_id,
    });
  }
}
