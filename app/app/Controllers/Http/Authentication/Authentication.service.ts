import Mail from "App/Utils/Mail";
import User from "App/Models/User";
import Env from "@ioc:Adonis/Core/Env";
import ApiToken from "App/Models/ApiToken";
import Database from "@ioc:Adonis/Lucid/Database";
import { DateTime } from "luxon";
import { AuthContract } from "@ioc:Adonis/Addons/Auth";

export default class AuthenticationService {
  /**
   *
   * @param userData
   * @param auth
   * @returns
   */
  public async signup(userData: Partial<User>, auth: AuthContract) {
    const user = await User.create(userData);

    await this.sendVerificationMail(user);
    const token = await auth.use("api").login(user);
    return {
      token,
      user,
    };
  }

  /**
   *
   * @param token
   * @returns
   */
  public async verifyEmail(token: string) {
    const _token = await ApiToken.query()
      .where("type", "verification")
      .where("token", token)
      .preload("user")
      .firstOrFail();
    if (_token.expiresAt < DateTime.now()) {
      await _token.delete();
      await this.sendVerificationMail(_token.user);
      return {
        msg: "token expired and new one is sent to you",
      };
    }
    const transaction = await Database.transaction();
    try {
      await Promise.all([
        User.query()
          .useTransaction(transaction)
          .where("id", _token.userId)
          .update({
            is_verified: true,
          }),

        _token.useTransaction(transaction).delete(),
      ]);
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.error(transaction);
    }
    return {
      msg: "email verified",
    };
  }
  
  /**
   *
   * @param email
   * @param password
   * @param auth
   * @returns
   */
  public async login(email: string, password: string, auth: AuthContract) {
    const token = await auth.use("api").attempt(email, password);
    return {
      token,
    };
  }

  /**
   *
   * @param user
   * @returns
   */
  private async sendVerificationMail(user: User) {
    const verificationToken = await ApiToken.create({
      userId: user.id,
      type: "verification",
      name: "verification",
    });

    return Mail.send(user.email, {
      subject: "Welcome, please verify your account",
      // this would be replaced with a more appropriate email template with proper styling
      content: `please, click <a href="${Env.get(
        "APP_URL"
      )}/api/auth/verify?token=${
        verificationToken.token
      }">this</a> link to verify your account`,
    });
  }
}
