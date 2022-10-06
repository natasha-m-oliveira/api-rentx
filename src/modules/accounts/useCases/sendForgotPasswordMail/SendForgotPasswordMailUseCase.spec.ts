import { InMemoryUsersRepository } from "@modules/accounts/repositories/implementations/InMemoryUsersRepository";
import { InMemoryUsersTokensRepository } from "@modules/accounts/repositories/implementations/InMemoryUsersTokensRepository";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { InMemoryMailProvider } from "@shared/container/providers/MailProvider/implementations/InMemoryMailProvider";

import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase";

let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
let usersRepository: InMemoryUsersRepository;
let usersTokensRepository: InMemoryUsersTokensRepository;
let dateProvider: DayjsDateProvider;
let mailProvider: InMemoryMailProvider;
describe("Send Forgot Mail", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    usersTokensRepository = new InMemoryUsersTokensRepository();
    dateProvider = new DayjsDateProvider();
    mailProvider = new InMemoryMailProvider();
    sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
      usersRepository,
      usersTokensRepository,
      dateProvider,
      mailProvider
    );
  });

  it("should be able to send a forgot password mail to user", async () => {
    const sendMail = jest.spyOn(mailProvider, "sendMail");
    const user = await usersRepository.create({
      name: "Kathryn Roy",
      driver_license: "614476",
      email: "domvon@itohu.fr",
      password: "1234",
    });
    const message = await sendForgotPasswordMailUseCase.execute(user.email);
    expect(sendMail).toBeCalled();
    expect(message).toBeTruthy();
  });

  it("should not be able to send an email if user does not exists", async () => {
    const sendMail = jest.spyOn(mailProvider, "sendMail");

    const message = await sendForgotPasswordMailUseCase.execute("ru@do.gd");
    expect(sendMail).not.toHaveBeenCalled();
    expect(message).toBeTruthy();
  });

  it("should be able to create an users token", async () => {
    const generateTokenMail = jest.spyOn(usersTokensRepository, "create");
    const user = await usersRepository.create({
      name: "Clayton Butler",
      driver_license: "792313",
      email: "perdo@cujhetcul.my",
      password: "1234",
    });
    await sendForgotPasswordMailUseCase.execute(user.email);
    expect(generateTokenMail).toBeCalled();
  });
});
