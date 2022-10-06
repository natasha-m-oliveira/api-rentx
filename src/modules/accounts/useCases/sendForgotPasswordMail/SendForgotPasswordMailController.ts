import { Request, Response } from "express";
import { container } from "tsyringe";

import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase";

export class SendForgotPasswordMailController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;
    const sendForgotPasswordMailUseCase = container.resolve(
      SendForgotPasswordMailUseCase
    );

    const message = await sendForgotPasswordMailUseCase.execute(email);

    return response.json({ message });
  }
}
