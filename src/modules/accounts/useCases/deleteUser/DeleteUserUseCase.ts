import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";

@injectable()
export class DeleteUserUseCase {
  constructor(
    @inject("UsersRepository")
    private readonly usersRepository: IUsersRepository
  ) {}

  async execute(id: string): Promise<void> {
    await this.usersRepository.deleteById(id);
  }
}
