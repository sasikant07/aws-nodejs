import { verifytoken } from "../utils/auth.js";
import buildResponse from "../utils/utils.js";

const verify = async (requestBody) => {
  if (!requestBody.user || !requestBody.user.username || !requestBody.token) {
    return buildResponse(401, {
      verified: false,
      message: "Incorrect request body",
    });
  }

  const { user, token } = requestBody;
  const verification = verifytoken(user.username, token);

  if (!verification.verified) {
    return buildResponse(401, verification);
  }

  return buildResponse(200, {
    verified: true,
    message: "Success",
    user,
    token,
  });
};

export default verify;