import fs from "fs";
import { resolve } from "path";
import { v4 as uuidV4 } from "uuid";

import { ICreateSpecificationDTO } from "@modules/cars/dtos/ICreateSpecificationDTO";

import createConnection from "../";

async function create(): Promise<void> {
  const connection = await createConnection("localhost");

  const filePath = resolve(__dirname, "specifications.json");

  const fileContent = await fs.promises.readFile(filePath, "utf8");
  const specifications: ICreateSpecificationDTO[] = JSON.parse(fileContent);

  await Promise.all(
    specifications.map(async ({ name, description }) => {
      const id = uuidV4();
      return await connection.query(
        `INSERT INTO specifications(id, name, description, created_at)
          values('${id}', '${name}', '${description}', now())`
      );
    })
  );

  await connection.close();
}

void create().then(() => console.log("Specifications created!"));
