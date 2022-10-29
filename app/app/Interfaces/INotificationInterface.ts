import Check from "App/Models/Check";
import User from "App/Models/User";

export default interface INotificationInterface {
   notify(user: User, check: Check, err: Object);
}
