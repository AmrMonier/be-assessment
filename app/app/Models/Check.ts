import { DateTime } from "luxon";
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  computed,
  HasMany,
  hasMany,
} from "@ioc:Adonis/Lucid/Orm";
import User from "./User";
import { Method, Protocol, Status } from "App/Types/Check.types";
import CheckLog from "./CheckLog";
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
  public method: Method;

  @column({ serializeAs: null })
  public downCount: number | null;

  @column({ serializeAs: null })
  public notification: string;

  @column({ serializeAs: null })
  public processId: string | null;

  @column()
  public upTime: number | null;

  @column()
  public downTime: number | null;

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
  public status: Status;

  @column()
  public userId: number;

  @column({ serialize: (value) => (value ? value.split(",") : []) })
  public tags: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @computed()
  public get notificationArray() {
    return this.notification.split(",") || [];
  }

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>;

  @hasMany(() => CheckLog)
  public logs: HasMany<typeof CheckLog>;
}
