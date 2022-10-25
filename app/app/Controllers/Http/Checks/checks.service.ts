import Check from "App/Models/Check";

export default class ChecksService {
  /**
   *
   * @param checkData
   * @param tags
   * @returns
   */
  public async createCheck(
    checkData: Partial<Check>,
    tags: { id: number | undefined; name: string | undefined }[] | undefined
  ) {
    const check = await Check.create(checkData);
    if (tags && tags.length > 0) {
      const alreadyExistingTags: number[] = [];
      const newTags: { name: string }[] = [];
      tags?.forEach((t) => {
        if (t.id) alreadyExistingTags.push(t.id);
        else newTags.push({ name: t.name! });
      });
      await check.related("tags").attach(alreadyExistingTags);
      await check.related("tags").createMany(newTags);
    }
    return check;
  }
}
