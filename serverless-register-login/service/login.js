import { generateToken } from "../utils/auth.js";
import buildResponse from "../utils/utils.js";
import bcrypt from "bcryptjs";
import AWS from "aws-sdk";

AWS.config.update({
  region: "us-east-1",
});

const dynamoodb = new AWS.DynamoDB.DocumentClient();
const userTable = "serverless-login-users";

const login = async (user) => {
  const { username, password } = user;

  if (!username || !password) {
    return buildResponse(401, {
      message: "Username and password are required",
    });
  }

  const dynamoUser = await getUser(username.toLowerCase().trim());
  if (!dynamoUser || !dynamoUser.username) {
    return buildResponse(403, { message: "User does not exist" });
  }

  if (!bcrypt.compareSync(password, dynamoUser.password)) {
    return buildResponse(403, { message: "Password is incorrect" });
  }

  const userInfo = {
    username: dynamoUser.username,
    name: dynamoUser.name,
  };

  const token = generateToken(userInfo);

  const response = {
    user: userInfo,
    token: token,
  };

  return buildResponse(200, response);
};

const getUser = async (username) => {
  const params = {
    TableName: userTable,
    Key: {
      username: username,
    },
  };

  return await dynamoodb
    .get(params)
    .promise()
    .then(
      (response) => response.Item,
      (error) => {
        console.error("Error getting username: ", error);
      }
    );
};

export default login;
