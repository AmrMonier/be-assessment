import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import SignupValidator from "App/Validators/Authentication/SignupValidator";
import AuthenticationService from "./Authentication.service";

export default class AuthenticationController {
  authService = new AuthenticationService();
  
  /**
   *
   * @param param0
   * @returns
   */
  public async signup({ request, response, auth }: HttpContextContract) {
    const { email, name, password } = await request.validate(SignupValidator);
    const user = await this.authService.signup(
      {
        name,
        password,
        email,
      },
      auth
    );
    return response.json(user);
  }

  /**
   *
   * @param param0
   */
  public async verifyEmail({ request, response }: HttpContextContract) {
    const { token } = request.qs();
    const result = await this.authService.verifyEmail(token);
    response.json(result);
  }
}
