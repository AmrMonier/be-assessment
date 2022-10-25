import Route from "@ioc:Adonis/Core/Route";
Route.group(() => {
    Route.post('', 'Checks/checks.controller.createCheck')
})
  .prefix("/api/checks")
  .middleware(["auth"]);
