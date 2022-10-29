import CustomException from "App/Exceptions/CustomException";
import Check from "App/Models/Check";
import axios from "axios";
import { Agent } from "https";
import { Protocol, Status } from "App/Types/Check.types";
import { Socket } from "net";
import Event from "@ioc:Adonis/Core/Event";
class MonitoringProcessManager {
  private constructor() {}
  private static instance: MonitoringProcessManager;
  private jobsStorage: { [key: string]: NodeJS.Timer } = {};
  /**
   *
   * @returns
   */
  public static getInstance() {
    if (MonitoringProcessManager.instance)
      return MonitoringProcessManager.instance;
    MonitoringProcessManager.instance = new MonitoringProcessManager();
    return MonitoringProcessManager.instance;
  }
  /**
   *
   * @param key
   * @param process
   */
  public async addTask(check: Check) {
    // TODO:: incase of more protocols comes up this feature would need a refactoring by creating an interface to unify the structure of monitoring process.
    // and a mapper class to allow ease of access to them without any conditioning like this
    if (check.processId && this.jobsStorage[check.processId]) {
      throw new CustomException("there is already a job with this key", 422);
    }
    if (check.protocol === Protocol.HTTP || check.protocol === Protocol.HTTPS) {
      const process = await this.scheduleHttpCheck(check);
      this.jobsStorage[process.id!] = process.process;
      return;
    }
    if (check.protocol === Protocol.TCP) {
      const process = await this.scheduleTcpCheck(check);
      this.jobsStorage[process.id!] = process.process;
      return;
    }
    throw new CustomException("no handling for this protocol is provided");
  }

  /**
   *
   * @param key
   */
  public async removeTask(key: string) {
    if (!this.jobsStorage[key])
      throw new CustomException("no job with this key", 422);
    const process = this.jobsStorage[key];
    clearInterval(process);
    delete this.jobsStorage[key];
  }
  // TODO:: refactor both scheduling methods into smaller pieces
  /**
   *
   * @param check
   * @returns
   */
  private async scheduleHttpCheck(check: Check) {
    const process = setInterval(async () => {
      try {
        await check.refresh();
        let startTime = Date.now();
        // here we are checking if the server is up and running and only 5xx responses would be throw an error any 4xx responses indicate that the server is up and a user error occurred
        await axios
          .create({
            method: check.method,
            url: check.url,
            baseURL: `${check.protocol}://${check.url}${
              Number.isInteger(check.port) ? `:${check.port}` : ""
            }`,
            auth: check.authentication
              ? {
                  username: check.authentication.username!,
                  password: check.authentication.password!,
                }
              : undefined,
            headers: check.headers,
            timeout: check.timeout * 1000,
            httpsAgent: new Agent({
              rejectUnauthorized: check.ignoreSsl,
            }),
          })
          .request({});
        if (check.status === Status.DOWN)
          Event.emit("check:statusChanged", { check });
        await Promise.all([
          check
            .merge({
              status: Status.UP,
              upTime: check.interval * 60 + (check.upTime || 0),
              downTime: null,
              downCount: null,
            })
            .save(),
          check.related("logs").create({
            responseTime: Date.now() - startTime,
            status: check.status,
          }),
        ]);
      } catch (error) {
        await Promise.all([
          check.related("logs").create({
            status: Status.DOWN,
          }),
          check
            .merge({
              status: Status.DOWN,
              upTime: null,
              downTime: check.interval * 60 + (check.downTime || 0),
              downCount: (check.downCount || 0) + 1,
            })
            .save(),
        ]);
        if (check.threshold <= (check.downCount || 0))
          Event.emit("check:statusChanged", { check, err: error });
      }
    }, check.interval * 60 * 1000);
    await check
      .merge({
        processId: `${check.id}-${check.name}`,
        active: true,
      })
      .save();
    return { id: check.processId, process };
  }

  /**
   *
   * @param check
   * @returns
   */
  private async scheduleTcpCheck(check: Check) {
    const process = setInterval(async () => {
      await check.refresh();
      let startTime = Date.now();
      const socket = new Socket();
      const timeoutId = setTimeout(async () => {
        clearTimeout(timeoutId);
        socket.destroy();
        await Promise.all([
          check.related("logs").create({
            status: Status.DOWN,
          }),
          check
            .merge({
              status: Status.DOWN,
              upTime: null,
              downTime: check.interval * 60 + (check.downTime || 0),
              downCount: (check.downCount || 0) + 1,
            })
            .save(),
        ]);
        if (check.threshold <= (check.downCount || 0))
          Event.emit("check:statusChanged", { check });
      }, check.timeout * 1000);

      socket.connect(
        {
          path: check.path,
          port: check.port!,
          host: check.url,
        },
        async () => {
          clearTimeout(timeoutId);
          socket.destroy();
          if (check.status === Status.DOWN)
            Event.emit("check:statusChanged", { check });
          await Promise.all([
            check
              .merge({
                status: Status.UP,
                upTime: check.interval * 60 + (check.upTime || 0),
                downTime: null,
                downCount: null,
              })
              .save(),
            check.related("logs").create({
              responseTime: Date.now() - startTime,
              status: check.status,
            }),
          ]);
        }
      );
    }, check.interval * 60 * 1000);
    await check
      .merge({
        processId: `${check.id}-${check.name}`,
        active: true,
      })
      .save();
    return { id: check.processId, process };
  }
}

export default MonitoringProcessManager.getInstance();
