import type { EventsList } from "@ioc:Adonis/Core/Event";
import { NotificationTypes } from "App/Types/Check.types";
import MailNotification from "App/Utils/MailNotification";
import axios from "axios";
import { DateTime } from "luxon";

export default class CheckStatus {
  /**
   *
   * @param param0
   */
  public async onStatusChanged({
    check,
    err,
  }: EventsList["check:statusChanged"]) {
    if (check.webhook) {
      await axios.post(check.webhook, {
        ...check.serialize(),
        timestamp: DateTime.now().toISO().toString(),
      });
    }
    // for now the only email is allowed and is assigned by default by the db if any other methods appear add a field in the validator
    // and to the notification enum for typing and add another case to the switch statement
    // make sure to make a notification class for it which implements the INotificationInterface
    check.notificationArray.forEach(async (notification) => {
      switch (notification) {
        case NotificationTypes.EMAIL:
          const notifier = new MailNotification();
          await check.load("user");
          await notifier.notify(check.user, check, err);
          break;
      }
    });
  }
}
