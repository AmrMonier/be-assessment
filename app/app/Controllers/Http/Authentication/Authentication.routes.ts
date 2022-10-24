import Route from "@ioc:Adonis/Core/Route";
Route.group(() => {
  Route.post("signup", "Authentication/Authentication.controller.signup");
  Route.get("verify", "Authentication/Authentication.controller.verifyEmail");

}).prefix("/api/auth");
