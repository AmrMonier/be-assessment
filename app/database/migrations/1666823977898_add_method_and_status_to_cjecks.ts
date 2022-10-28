import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "checks";

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.enum("method", ["GET", "PUT", "DELETE", "POST"]).defaultTo("GET");
      table.enum("status", ["UP", "DOWN"]);
      table.string("process_id").nullable();
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumns("status", "method", "process_id");
    });
  }
}
