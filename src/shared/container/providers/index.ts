import { container } from "tsyringe";

import "dotenv/config";
import { IDateProvider } from "./DateProvider/IDateProvider";
import { DayjsDateProvider } from "./DateProvider/implementations/DayjsDateProvider";
import { IMailProvider } from "./MailProvider/IMailProvider";
import { EtherealMailProvider } from "./MailProvider/implementations/EtherealMailProvider";
import { LocalStorageProvider } from "./StorageProvider/implementations/LocalStorageProvider";
import { S3StorageProvider } from "./StorageProvider/implementations/S3StorageProvider";
import { IStorageProvider } from "./StorageProvider/IStorageProvider";
import { JWTTokenProvider } from "./TokenProvider/implementations/JWTTokenProvider";
import { ITokenProvider } from "./TokenProvider/ITokenProvider";

container.registerSingleton<IDateProvider>("DateProvider", DayjsDateProvider);

container.registerSingleton<ITokenProvider>("TokenProvider", JWTTokenProvider);

container.registerInstance<IMailProvider>(
  "MailProvider",
  new EtherealMailProvider()
);

const diskStorage = {
  local: LocalStorageProvider,
  s3: S3StorageProvider,
};

container.registerSingleton<IStorageProvider>(
  "StorageProvider",
  diskStorage[process.env.DISK]
);
