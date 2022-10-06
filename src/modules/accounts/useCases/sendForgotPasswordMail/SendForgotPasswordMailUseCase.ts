import { resolve } from "path";
import { inject, injectable } from "tsyringe";
import { v4 as uuidV4 } from "uuid";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";

@injectable()
export class SendForgotPasswordMailUseCase {
  constructor(
    @inject("UsersRepository")
    private readonly usersRepository: IUsersRepository,
    @inject("UsersTokensRepository")
    private readonly usersTokensRepository: IUsersTokensRepository,
    @inject("DateProvider")
    private readonly dateProvider: IDateProvider,
    @inject("MailProvider")
    private readonly mailProvider: IMailProvider
  ) {}

  async execute(email: string): Promise<string> {
    const message = "Verifique seu email";
    const user = await this.usersRepository.findByEmail(email);
    const templatePath = resolve(
      __dirname,
      "..",
      "..",
      "views",
      "emails",
      "forgotPassword.hbs"
    );

    if (!user) {
      return message;
    }

    const token = uuidV4();

    const variables = {
      name: user.name,
      link: `${process.env.FORGOT_MAIL_URL}${token}`,
    };

    const expires_date = this.dateProvider.addDays(3);

    await this.usersTokensRepository.deleteByUser(user.id);

    await this.usersTokensRepository.create({
      refresh_token: token,
      user_id: user.id,
      expires_date,
    });

    await this.mailProvider.sendMail(
      email,
      "Recuperação de senha",
      variables,
      templatePath
    );
    return message;
  }
}
