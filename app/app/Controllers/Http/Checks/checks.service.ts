import CustomException from "App/Exceptions/CustomException";
import Check from "App/Models/Check";
import { DateTime } from "luxon";

interface Tags {
  name: string | undefined;
  id: number | undefined;
}
export default class ChecksService {
  /**
   *
   * @param checkData
   * @param tags
   * @returns
   */
  public async createCheck(
    checkData: Partial<Check>,
    tags: Tags[] | undefined
  ) {
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
    tags: Tags[] | undefined
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
   * @param tags
   */
  private async attachTags(check: Check, tags: Tags[]) {
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
