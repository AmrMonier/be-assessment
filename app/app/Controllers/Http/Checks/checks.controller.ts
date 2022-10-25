import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

import CreateCheckValidator from "App/Validators/Checks/CreateCheckValidator";
import ChecksService from "./checks.service";

export default class ChecksController {
  checkService = new ChecksService();
  /**
   *
   * @param param0
   * @returns
   */
  public async createCheck({ request, response, auth }: HttpContextContract) {
    const { tags, ...checkPayload } = await request.validate(
      CreateCheckValidator
    );
    const check = await this.checkService.createCheck(
      { ...checkPayload, userId: auth.user?.id! },
      tags
    );
    return response.created({
      msg: "check created",
      data: check,
    });
  }
}
