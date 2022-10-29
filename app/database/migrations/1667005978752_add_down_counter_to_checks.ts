import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'checks'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('down_count').defaultTo(null)
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('down_count')
    })
  }
}
