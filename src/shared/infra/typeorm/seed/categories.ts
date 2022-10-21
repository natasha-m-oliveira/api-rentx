import fs from "fs";
import { resolve } from "path";
import { v4 as uuidV4 } from "uuid";

import { ICreateCategoryDTO } from "@modules/cars/dtos/ICreateCategoryDTO";

import createConnection from "../";

async function create(): Promise<void> {
  const connection = await createConnection("localhost");

  const filePath = resolve(__dirname, "categories.json");

  const fileContent = await fs.promises.readFile(filePath, "utf8");
  const categories: ICreateCategoryDTO[] = JSON.parse(fileContent);

  await Promise.all(
    categories.map(async ({ name, description }) => {
      const id = uuidV4();
      return await connection.query(
        `INSERT INTO categories(id, name, description, created_at)
          values('${id}', '${name}', '${description}', now())`
      );
    })
  );

  await connection.close();
}

void create().then(() => console.log("Categories created!"));
