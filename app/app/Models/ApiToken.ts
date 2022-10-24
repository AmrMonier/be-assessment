import { DateTime } from "luxon";
import {
  BaseModel,
  beforeCreate,
  BelongsTo,
  belongsTo,
  column,
} from "@ioc:Adonis/Lucid/Orm";
import { randomBytes } from "crypto";
import User from "./User";

export default class ApiToken extends BaseModel {
  public static table = "api_tokens";
  @column({ isPrimary: true })
  public id: number;

  @column()
  public userId: number;

  @column()
  public name: string;

  @column()
  public type: string;

  @column()
  public token: string;

  @column()
  public expiresAt: DateTime;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>;

  @beforeCreate()
  public static setExpiryDate(token: ApiToken) {
    token.expiresAt = DateTime.now().plus({ minutes: 45 });
    token.token = randomBytes(16).toString("hex");
  }
}
