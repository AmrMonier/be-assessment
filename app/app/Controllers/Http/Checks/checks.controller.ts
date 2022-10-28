import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import CheckIdValidator from "App/Validators/Checks/CheckIdValidator";

import CreateCheckValidator from "App/Validators/Checks/CreateCheckValidator";
import FetchCheckValidator from "App/Validators/Checks/FetchCheckValidator";
import UpdateCheckValidator from "App/Validators/Checks/UpdateCheckValidator";
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

  /**
   *
   * @param param0
   * @returns
   */
  public async updateCheck({ request, response }: HttpContextContract) {
    const { tags, id, ...checkPayload } = await request.validate(
      UpdateCheckValidator
    );
    const check = await this.checkService.updateCheck(id, checkPayload, tags);
    return response.ok({
      msg: "check updated",
      data: check,
    });
  }

  /**
   *
   * @param param0
   * @returns
   */
  public async deleteCheck({ request, response, auth }: HttpContextContract) {
    const { id } = await request.validate(CheckIdValidator);
    const check = await this.checkService.deleteCheck(id, auth.user?.id!);
    return response.ok({
      msg: "check deleted",
      data: check,
    });
  }

  /**
   *
   * @param param0
   * @returns
   */
  public async getSingleCheck({ params, response, auth }: HttpContextContract) {
    const { id } = params;
    const check = await this.checkService.getCheckByIdOrFail(
      id,
      auth.user?.id!
    );
    return response.ok({
      msg: "get check",
      data: check,
    });
  }

  /**
   *
   * @param param0
   * @returns
   */
  public async getAllUserChecks({
    request,
    response,
    auth,
  }: HttpContextContract) {
    const { from, to, page, perPage } = await request.validate(
      FetchCheckValidator
    );
    const checks = await this.checkService.getAllUserChecks(
      auth.user?.id!,
      from,
      to,
      page,
      perPage
    );
    return response.ok({
      msg: "get all checks",
      ...checks.toJSON(),
    });
  }
  /**
   *
   * @param param0
   * @returns
   */
  public async startMonitoring({
    params,
    auth,
    response,
  }: HttpContextContract) {
    const { id } = params;
    const check = await this.checkService.getCheckByIdOrFail(
      id,
      auth.user?.id!
    );
    await this.checkService.startMonitoring(check);
    return response.ok({
      msg: "started Monitoring",
      data: {},
    });
  }

  /**
   *
   * @param param0
   * @returns
   */
  public async stopMonitoring({ params, auth, response }: HttpContextContract) {
    const { id } = params;
    const check = await this.checkService.getCheckByIdOrFail(
      id,
      auth.user?.id!
    );
    await this.checkService.stopMonitoring(check);
    return response.ok({
      msg: "stopped Monitoring",
      data: {},
    });
  }

  /**
   *
   * @param param0
   * @returns
   */
  public async checkReport({ params, response }: HttpContextContract) {
    const { id } = params;
    const check = await this.checkService.checkReport(id);
    return response.ok({
      msg: "stopped Monitoring",
      data: { check },
    });
  }
}
