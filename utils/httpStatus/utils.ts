import { fail } from "assert";

export const BadRequest = (obj?: Object) => {
  const res = obj
    ? obj
    : { message: "400 - Bad Request: Please try again later" };
  return Response.json({ ...res }, {
    status: 400,
    statusText: "Bad Request",
  });
};
export const Unauthorized = (obj?: Object) => {
  const res = obj ? obj : { message: "Unauthorized request from client" };
  return Response.json({ ...res }, {
    status: 401,
    statusText: "Unauthorized",
  });
};
export const Forbidden = (obj?: Object) => {
  const res = obj ? obj : { message: "Forbidden request" };
  return Response.json({ ...res }, {
    status: 403,
    statusText: "Forbidden",
  });
};
export const NotFound = (obj?: Object) => {
  const res = obj ? obj : { message: "Requested resource not found" };
  return Response.json({ ...res }, {
    status: 404,
    statusText: "Not Found",
  });
};
export const ServerError = (obj?: Object) => {
  const res = obj
    ? obj
    : { message: "Internal Server Error: Please try again in another time" };
  return Response.json({ ...res }, {
    status: 500,
    statusText: "Internal Server Error",
  });
};
export const OK = (obj?: Object) => {
  const res = obj ? obj : { message: "Success" };
  return Response.json({ ...res }, { status: 200, statusText: "OK" });
};
