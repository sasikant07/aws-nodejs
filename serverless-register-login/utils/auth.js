import jwt from "jsonwebtoken";

export const generateToken = (userInfo) => {
  if (!userInfo) {
    return null;
  }

  return jwt.sign(userInfo, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

export const verifytoken = (username, token) => {
  return jwt.verify(token, process.env.JWT_SECRET, (error, response) => {
    if (error) {
      return {
        verified: false,
        message: "Invalid token",
      };
    }
    if (response.username !== username) {
      return {
        verified: false,
        message: "Invalid user",
      };
    }

    return {
      verified: true,
      message: "Verified",
    };
  });
};
