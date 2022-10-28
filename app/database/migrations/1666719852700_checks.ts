import BaseSchema from "@ioc:Adonis/Lucid/Schema";
import User from "App/Models/User";
import { Protocol } from "App/Types/Check.types";

export default class extends BaseSchema {
  protected tableName = "checks";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");
      table.string("name");
      table.string("url");
      table.enum("protocol", [Protocol.HTTP, Protocol.HTTPS, Protocol.TCP]);
      table.string("path").nullable();
      table.integer("port").nullable();
      table.string("webhook").nullable();
      table.integer("interval").defaultTo(10 * 60 * 1000);
      table.integer("threshold").defaultTo(1);
      table.integer("timeout").defaultTo(5 * 1000);
      table.boolean("ignore_ssl").defaultTo(true);
      table.json("authentication").nullable();
      table.json("headers").nullable();
      table.json("asserts").nullable();
      table.boolean("active").defaultTo(false);
      table.integer("user_id").notNullable();
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp("created_at", { useTz: true });
      table.timestamp("updated_at", { useTz: true });

      table
        .foreign("user_id")
        .references("id")
        .inTable(User.table)
        .onDelete("CASCADE");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
