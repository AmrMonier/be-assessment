import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";
import { Status } from "App/Types/Check.types";

export default class CheckLog extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public responseTime: number;

  @column()
  public status: Status;

  @column()
  public checkId: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;
}
