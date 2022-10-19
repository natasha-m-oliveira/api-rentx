import { InMemoryUsersRepository } from "@modules/accounts/repositories/implementations/InMemoryUsersRepository";

import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let usersRepository: InMemoryUsersRepository;
describe("Create User", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "Roxie Luna",
      password: "384526",
      email: "morolsoj@ligac.la",
      driver_license: "84347723219",
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create user already exists", async () => {
    await createUserUseCase.execute({
      name: "Irene Mendez",
      password: "276906",
      email: "zavwahah@zifede.nu",
      driver_license: "20604609864",
    });

    await expect(
      createUserUseCase.execute({
        name: "Isaiah Gilbert",
        password: "135299",
        email: "zavwahah@zifede.nu",
        driver_license: "39515047176",
      })
    ).rejects.toBeInstanceOf(CreateUserError);
  });
});
