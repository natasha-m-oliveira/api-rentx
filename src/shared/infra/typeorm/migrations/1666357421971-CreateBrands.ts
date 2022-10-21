import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class CreateBrands1666357421971 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "brands",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "name",
            type: "varchar",
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
        ],
      })
    );

    await queryRunner.addColumn(
      "cars",
      new TableColumn({
        name: "brand_id",
        type: "uuid",
        isNullable: true,
      })
    );

    await queryRunner.createForeignKey(
      "cars",
      new TableForeignKey({
        name: "FKBrandCar",
        referencedTableName: "brands",
        referencedColumnNames: ["id"],
        columnNames: ["brand_id"],
        onDelete: "SET NULL",
        onUpdate: "SET NULL",
      })
    );

    await queryRunner.dropColumn("cars", "brand");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "cars",
      new TableColumn({
        name: "brand",
        type: "varchar",
        isNullable: true,
      })
    );
    await queryRunner.dropForeignKey("cars", "FKBrandCar");
    await queryRunner.dropColumn("cars", "brand_id");
    await queryRunner.dropTable("brands");
  }
}
