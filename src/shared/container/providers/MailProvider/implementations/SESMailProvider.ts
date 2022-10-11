import { SES } from "aws-sdk";
import fs from "fs";
import handlebars from "handlebars";
import nodemailer, { Transporter } from "nodemailer";

import { IMailProvider } from "../IMailProvider";

export class SESMailProvider implements IMailProvider {
  private client: Transporter;
  constructor() {
    void this.createClient();
  }

  private async createClient(): Promise<void> {
    try {
      this.client = nodemailer.createTransport({
        SES: new SES({
          apiVersion: "2010-12-01",
          region: process.env.AWS_REGION,
        }),
      });
    } catch (err) {
      if (typeof err === "string") {
        console.error(`SESMailProvider - Error:\n${err}`);
      } else if (err instanceof Error) {
        console.error(`SESMailProvider - Error:\n${err.message}`);
      }
    }
  }

  async sendMail(
    to: string,
    subject: string,
    variables: any,
    path: string
  ): Promise<void> {
    if (!this.client) {
      await this.createClient();
    }
    const templateFileContent = fs.readFileSync(path).toString("utf-8");
    const templateParse = handlebars.compile(templateFileContent);
    const templateHTML = templateParse(variables);

    await this.client.sendMail({
      to,
      from: "Rentx <noreplay@rentx.com.br>",
      subject,
      html: templateHTML,
    });
  }
}
