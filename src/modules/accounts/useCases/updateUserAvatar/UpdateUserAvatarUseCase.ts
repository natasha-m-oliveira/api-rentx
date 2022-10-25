import fs from "fs";
import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IStorageProvider } from "@shared/container/providers/StorageProvider/IStorageProvider";
import { FileType, IFile, validate } from "@utils/file";

import { UpdateUserAvatarError } from "./UpdateUserAvatarError";

interface IRequest {
  user_id: string;
  avatar_file: IFile;
}

@injectable()
export class UpdateUserAvatarUseCase {
  constructor(
    @inject("UsersRepository")
    private readonly usersRepository: IUsersRepository,
    @inject("StorageProvider")
    private readonly storageProvider: IStorageProvider
  ) {}

  async execute({ user_id, avatar_file }: IRequest): Promise<void> {
    try {
      const invalidFile = !validate({
        file: avatar_file,
        type: FileType.IMAGE,
      });

      if (invalidFile) {
        throw new UpdateUserAvatarError();
      }

      const user = await this.usersRepository.findById(user_id);

      if (user.avatar) {
        await this.storageProvider.delete(user.avatar, "avatar");
      }

      await this.storageProvider.save(avatar_file.filename, "avatar");

      user.avatar = avatar_file.filename;

      await this.usersRepository.create(user);
    } catch (error) {
      await fs.promises.unlink(avatar_file.path);
      throw error;
    }
  }
}
