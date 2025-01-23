import register from "./service/register.js";
import login from "./service/login.js";
import verify from "./service/verify.js";
import buildResponse from "./utils/utils.js";

const healthPath = "/health";
const registerPath = "/register";
const loginPath = "/login";
const verifyPath = "/verify";

export const handler = async (event) => {
  console.log("request Event:", JSON.stringify(event));

  let response;

  switch (true) {
    case event.httpMethod === "GET" && event.path === healthPath:
      response = buildResponse(200);
      break;
    case event.httpMethod === "POST" && event.path === registerPath:
      const registerBody = JSON.parse(event.body);
      response = await register(registerBody);
      break;
    case event.httpMethod === "POST" && event.path === loginPath:
      const loginBody = JSON.parse(event.body);
      response = await login(loginBody);
      break;
    case event.httpMethod === "POST" && event.path === verifyPath:
      const verifyBody = JSON.parse(event.body);
      response = await verify(verifyBody);
      break;
    default:
      response = buildResponse(404, "404 Not Found");
      break;
  }
  return response;
};
