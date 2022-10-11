import "dotenv/config";
import fs from "fs";
import handlebars from "handlebars";
import nodemailer, { Transporter } from "nodemailer";

import { IMailProvider } from "../IMailProvider";

export class GmailMailProvider implements IMailProvider {
  private client: Transporter;
  constructor() {
    void this.createClient();
  }

  private async createClient(): Promise<void> {
    try {
      this.client = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
          user: process.env.APP_EMAIL,
          pass: process.env.APP_EMAIL_PASS,
        },
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

    try {
      await this.client.sendMail({
        to,
        from: `"Rentx" <${process.env.APP_EMAIL}>`,
        subject,
        html: templateHTML,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
