import buildResponse from "../utils/utils.js";
import bcrypt from "bcryptjs";
import AWS from "aws-sdk";

AWS.config.update({
  region: "us-east-1",
});

const dynamoodb = new AWS.DynamoDB.DocumentClient();
const userTable = "serverless-login-users";

const register = async (userInfo) => {
  const { name, email, username, password } = userInfo;

  if (!name || !email || !username || !password) {
    return buildResponse(401, {
      message: "All fields are required",
    });
  }

  const dynamoUser = await getUser(username);

  if (dynamoUser && dynamoUser.username) {
    return buildResponse(401, {
      message:
        "Username already exists in our database. Please choose a different username",
    });
  }

  const encryptedPW = bcrypt.hashSync(password.trim(), 10);
  const user = {
    name,
    email,
    username: username.toLowerCase().trim(),
    password: encryptedPW,
  };

  const saveUserResponse = await saveUser(user);

  if (!saveUserResponse) {
    return buildResponse(503, {
      message: "Server Error. Please try again later.",
    });
  }

  return buildResponse(200, { username });
};

const getUser = async (username) => {
  const params = {
    TableName: userTable,
    Key: {
      username,
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

const saveUser = async (user) => {
  const params = {
    TableName: userTable,
    Item: user,
  };

  return await dynamoodb
    .put(params)
    .promise()
    .then(
      () => true,
      (error) => {
        console.error("Error saving user: ", error);
      }
    );
};

export default register;