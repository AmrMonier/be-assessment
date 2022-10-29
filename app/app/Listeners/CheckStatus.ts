import type { EventsList } from "@ioc:Adonis/Core/Event";
import MailNotification from "App/Utils/MailNotification";

export default class CheckStatus {
  public async onStatusChanged({
    check,
    err,
  }: EventsList["check:statusChanged"]) {
    const notifier = new MailNotification();
    await check.load("user");
    await notifier.notify(check.user, check, err);
  }
}
