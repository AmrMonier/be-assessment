
import Env from "@ioc:Adonis/Core/Env";
import axios from "axios";

export default class PushOver {
  private static UserKey = Env.get("PUSH_OVER_USER_KEY");
  private static App_key = Env.get("PUSH_OVER_API_KEY");
  public static async send(
    to: string,
    options: { subject: string; content: string }
  ) {
    try {
      const result = await axios.post(
        "https://api.pushover.net/1/messages.json",
        {
          token: PushOver.App_key,
          user: PushOver.UserKey,
          message: options.subject + '\n' + options.subject,
        }
      );
      console.log(result);
    } catch (err) {
      console.error(err);
      return;
    }
  }
}
