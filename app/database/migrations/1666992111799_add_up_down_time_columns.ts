import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "checks";

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer("up_time").defaultTo(null);
      table.integer("down_time").defaultTo(null);
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumns("up_time", "down_time");
    });
  }
}
