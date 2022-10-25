import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Check from 'App/Models/Check'
import Tag from 'App/Models/Tag'

export default class extends BaseSchema {
  protected tableName = 'check_tags'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('tag_id')
      table.integer('check_id')
      
      table.foreign('tag_id').references('id').inTable(Tag.table).onDelete('CASCADE')
      table.foreign('check_id').references('id').inTable(Check.table).onDelete('CASCADE')
      
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
