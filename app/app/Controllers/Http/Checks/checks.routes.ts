import Route from "@ioc:Adonis/Core/Route";
Route.group(() => {
  Route.post("", "Checks/checks.controller.createCheck");
  Route.patch("", "Checks/checks.controller.updateCheck");
  Route.put("", "Checks/checks.controller.updateCheck");
  Route.delete("", "Checks/checks.controller.deleteCheck");
  Route.post("all", "Checks/checks.controller.getAllUserChecks");
  Route.get(":id", "Checks/checks.controller.getSingleCheck");
  Route.post(":id/start", "Checks/checks.controller.startMonitoring");
  Route.post(":id/stop", "Checks/checks.controller.stopMonitoring");
  Route.get(":id/report", "Checks/checks.controller.checkReport");
})
  .prefix("/api/checks")
  .middleware(["auth"]);
