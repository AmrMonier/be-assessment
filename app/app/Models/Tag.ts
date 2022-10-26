import {
  BaseModel,
  column,
  manyToMany,
  ManyToMany,
} from "@ioc:Adonis/Lucid/Orm";
import Check from "./Check";

export default class Tag extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @manyToMany(() => Check, {
    pivotTable: "check_tags",
  })
  public checks: ManyToMany<typeof Check>;
}
