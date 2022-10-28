import CustomException from "App/Exceptions/CustomException";
import Check from "App/Models/Check";
import { DateTime } from "luxon";
import CronJobsManager from "App/Utils/MonitoringProcessManager";
import { Status, Tag } from "App/Types/Check.types";
import { HttpContext } from "@adonisjs/core/build/standalone";
export default class ChecksService {
  /**
   *
   * @param checkData
   * @param tags
   * @returns
   */
  public async createCheck(checkData: Partial<Check>, tags: Tag[] | undefined) {
    const check = await Check.create(checkData);
    if (tags && tags.length > 0) await this.attachTags(check, tags);
    return check;
  }

  /**
   *
   * @param checkId
   * @param checkData
   * @param tags
   */
  public async updateCheck(
    checkId: number,
    checkData: Partial<Check>,
    tags: Tag[] | undefined
  ) {
    const check = await Check.findOrFail(checkId);
    check.merge(checkData);
    if (tags && tags.length > 0) await this.attachTags(check, tags);
    await check.save();
    return check;
  }

  /**
   *
   * @param check
   * @returns
   */
  public async deleteCheck(checkId: number, userId: number) {
    const check = await Check.query()
      .where("id", checkId)
      .where("userId", userId)
      .firstOrFail();
    await check.delete();
    return check;
  }

  /**
   *
   * @param id
   * @returns
   */
  public async getCheckByIdOrFail(id: string, userId: number) {
    if (!+id) throw new CustomException("invalid id", 422);
    return Check.query().where("id", id).where("userId", userId).firstOrFail();
  }

  /**
   *
   * @param userId
   * @returns
   */
  public async getAllUserChecks(
    userId: number,
    from: DateTime | undefined,
    to: DateTime | undefined,
    page: number,
    perPage: number
  ) {
    return Check.query()
      .where("user_id", userId)
      .if(from, (q) => q.where("created_at", ">=", from?.toISO().toString()!))
      .if(to, (q) => q.where("created_at", "<=", to?.toISO().toString()!))
      .paginate(page, perPage);
  }
  /**
   *
   * @param check
   * @returns
   */
  public async startMonitoring(check: Check) {
    await CronJobsManager.addTask(check);
  }

  /**
   *
   * @param check
   * @returns
   */
  public async stopMonitoring(check: Check) {
    if (!check.processId || !check.active)
      throw new CustomException(
        "there is no active process for this check",
        422
      );
    await CronJobsManager.removeTask(check.processId!);
    return check.merge({ active: false, processId: null }).save();
  }
  /**
   *
   * @param checkId
   * @returns
   */
  public async checkReport(checkId: string) {
    const ctx = HttpContext.get();

    const check = await Check.query()
      .where("id", checkId)
      .where("user_id", ctx?.auth.user?.id!)
      .withAggregate("logs", (q) =>
        q.where("status", Status.UP).count("*").as("up_count")
      )
      .withAggregate("logs", (q) =>
        q.where("status", Status.DOWN).count("*").as("down_count")
      )
      .withAggregate("logs", (q) =>
        q
          .where("status", Status.UP)
          .avg("response_time")
          .as("average_response_time")
      )
      .withCount("logs")
      .preload("logs")
      .firstOrFail();

    return {
      status: check.status,
      availability: check.$extras.up_count / check.$extras.logs_count,
      outage: check.$extras.down_count,
      downtime: check.downTime, // if the server is down show for how long otherwise null
      uptime: check.upTime, // if the server is up show for how long otherwise null
      response_time: check.$extras.average_response_time,
      history: check.logs,
    };
  }

  /**
   *
   * @param check
   * @param tags
   */
  private async attachTags(check: Check, tags: Tag[]) {
    const alreadyExistingTags: number[] = [];
    const newTags: { name: string }[] = [];
    tags?.forEach((t) => {
      if (t.id) alreadyExistingTags.push(t.id);
      else newTags.push({ name: t.name! });
    });
    await check.related("tags").sync(alreadyExistingTags);
    await check.related("tags").createMany(newTags);
  }
}
