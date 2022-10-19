import { InMemoryUsersRepository } from "@modules/accounts/repositories/implementations/InMemoryUsersRepository";

import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Show User Profile", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("should be able to show the user's profile", async () => {
    const user = await createUserUseCase.execute({
      name: "Mittie Lucas",
      password: "042222",
      email: "lit@lura.cd",
      driver_license: "48063660258",
    });

    const result = await showUserProfileUseCase.execute(user.id);

    expect(result).toHaveProperty("email");
    expect(result.email).toEqual(user.email);
  });

  it("should not be able to show non-existent user profile", async () => {
    await expect(showUserProfileUseCase.execute("test")).rejects.toBeInstanceOf(
      ShowUserProfileError
    );
  });
});
