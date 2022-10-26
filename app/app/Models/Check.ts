import { DateTime } from "luxon";
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  ManyToMany,
  manyToMany,
} from "@ioc:Adonis/Lucid/Orm";
import User from "./User";
import Tag from "./Tag";
import { Protocol } from "App/Types/Protocols";
export default class Check extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @column()
  public protocol: Protocol;

  @column()
  public url: string;

  @column()
  public path: string;

  @column()
  public port: number | null;

  @column()
  public webhook: string;

  @column()
  public interval: number;

  @column()
  public threshold: number;

  @column()
  public timeout: number;

  @column()
  public ignoreSsl: boolean;

  @column()
  public authentication: {
    username: string | undefined;
    password: string | undefined;
  };

  @column()
  public headers: object;

  @column() public asserts: object;

  @column()
  public active: boolean;

  @column()
  public userId: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>;

  @manyToMany(() => Tag, {
    pivotTable: "check_tags",
  })
  tags: ManyToMany<typeof Tag>;
}
