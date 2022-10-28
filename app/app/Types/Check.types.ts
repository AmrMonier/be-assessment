import Check from "App/Models/Check";

export enum Protocol {
  HTTP = "HTTP",
  HTTPS = "HTTPS",
  TCP = "TCP",
}

export enum Method {
  GET = "GET",
  POST = "POST",
  DELETE = "DELETE",
  PUT = "PUT",
}

export enum Status {
  UP = "UP",
  DOWN = "DOWN",
}

export interface CheckMonitor {
  startMonitoring(check: Check);
}

export interface Tag {
  name: string | undefined;
  id: number | undefined;
}
