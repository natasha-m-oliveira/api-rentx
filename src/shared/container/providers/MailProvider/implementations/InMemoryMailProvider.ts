import { IMailProvider } from "../IMailProvider";

interface IMessage {
  to: string;
  subject: string;
  variables: any;
  path: string;
}

export class InMemoryMailProvider implements IMailProvider {
  private readonly messages: IMessage[] = [];

  async sendMail(
    to: string,
    subject: string,
    variables: any,
    path: string
  ): Promise<void> {
    this.messages.push({
      to,
      subject,
      variables,
      path,
    });
  }
}
