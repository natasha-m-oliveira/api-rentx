import fs from "fs";
import { resolve } from "path";
import { v4 as uuidV4 } from "uuid";

import { ICreateBrandDTO } from "@modules/cars/dtos/ICreateBrandDTO";

import createConnection from "../";

async function create(): Promise<void> {
  const connection = await createConnection("localhost");

  const filePath = resolve(__dirname, "brands.json");

  const fileContent = await fs.promises.readFile(filePath, "utf8");
  const brands: ICreateBrandDTO[] = JSON.parse(fileContent);

  await Promise.all(
    brands.map(async ({ name }) => {
      const id = uuidV4();
      return await connection.query(
        `INSERT INTO brands(id, name, created_at)
          values('${id}', '${name}', now())`
      );
    })
  );

  await connection.close();
}

void create().then(() => console.log("Brands created!"));
