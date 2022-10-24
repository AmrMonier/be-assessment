import Mail from "@ioc:Adonis/Addons/Mail";
import Env from "@ioc:Adonis/Core/Env";

export default class Mailer {
  private static sender = Env.get("SG_SENDER");
  public static async send(
    to: string,
    options: { subject: string; content: string }
  ) {
    try {
      const result = await Mail.use("smtp").send((msg) => {
        msg.to(to);
        msg.from(Mailer.sender);
        msg.html(options.content);
        msg.subject(options.subject);
      });
      console.log(result);
    } catch (err) {
      console.error(err);
      return;
    }
  }
}
