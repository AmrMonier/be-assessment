import INotificationInterface from "App/Interfaces/INotificationInterface";
import Check from "App/Models/Check";
import User from "App/Models/User";
import { Status } from "App/Types/Check.types";
import Mail from "./Mail";
export default class MailNotification implements INotificationInterface {
  /**
   *
   * @param user
   * @param check
   * @param err
   */
  public async notify(user: User, check: Check, err?: Object) {
    await Mail.send(user.email, {
      subject: "update on your website",
      content: `
      your website is ${check.status === Status.UP ? "back up again" : "down!!"}
    name: ${check.name}
    protocol: ${check.protocol}
    url: ${check.url}/${check.path}
    status: ${check.status}
    ${err ? "error: " + err.toString() : ""}
    uptime: ${check.upTime}
    downtime: ${check.downTime}
    `,
    });
  }
}
