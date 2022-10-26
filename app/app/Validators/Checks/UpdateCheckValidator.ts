import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { Protocol } from "App/Types/Protocols";
import Tag from "App/Models/Tag";
import Check from "App/Models/Check";
export default class UpdateCheckValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    id: schema.number([rules.exists({ table: Check.table, column: "id" })]),
    name: schema.string.optional({ trim: true }),
    url: schema.string.optional({}, [rules.url()]),
    protocol: schema.enum.optional([
      Protocol.HTTP,
      Protocol.HTTPS,
      Protocol.TCP,
    ]),
    path: schema.string.optional({ trim: true }),
    port: schema.number.optional([rules.unsigned()]),
    webhook: schema.string.optional({}, [rules.url()]),
    timeout: schema.number.optional([rules.unsigned()]),
    interval: schema.number.optional([rules.unsigned()]),
    threshold: schema.number.optional([rules.unsigned()]),
    authentication: schema.object.optional().members({
      username: schema.string.optional(),
      password: schema.string.optional(),
    }),
    headers: schema.object.optional().anyMembers(),
    asserts: schema.object.optional().anyMembers(),
    ignore_ssl: schema.boolean.optional([
      rules.requiredWhen("protocol", "=", Protocol.HTTPS),
    ]),
    tags: schema.array.optional().members(
      schema.object().members({
        id: schema.number.optional([
          rules.exists({ table: Tag.table, column: "id" }),
        ]),
        name: schema.string.optional({ trim: true }),
      })
    ),
  });

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {};
}
