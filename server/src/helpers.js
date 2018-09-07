const jwt = require("jsonwebtoken");
const APP_SECRET = "appsecret123";

const isLoggedIn = (resolve, parent, args, context, info) => {
  let Authorization;

  if (
    info.operation.operation === "query" ||
    info.operation.operation === "mutation"
  ) {
    Authorization = context.request.get("Authorization");
  }

  if (info.operation.operation === "subscription") {
    Authorization = context.connection.context.Authorization;
  }

  if (Authorization) {
    const token = Authorization.replace("Bearer ", "");
    const { userId } = jwt.verify(token, APP_SECRET);

    return resolve({ userId, ...parent });
  }

  throw new AuthError();
};

class AuthError extends Error {
  constructor() {
    super("Not authorized");
  }
}

module.exports = { isLoggedIn };
