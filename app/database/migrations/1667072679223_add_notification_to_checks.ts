import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "checks";

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string("notification").defaultTo("email");
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn("notification");
    });
  }
}
