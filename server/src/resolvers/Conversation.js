const { isLoggedIn } = require("../helpers");

const Conversation = {
  name({ name, participants, userId }, args, context, info) {
    // const { name, participants } = parent;
    // console.log(parent);
    // See this issue for more details https://github.com/prisma/graphql-yoga/issues/393#issuecomment-419085395
    // A workaround to solve this for now is do the logic on the client app

    // if (info.operation.operation === "subscription") {
    //   console.log(context.connection.context.Authorization);
    // }

    return name; // <-- Remove this line when headers are present on context for subscriptions
    // const userId = isLoggedIn(context);

    if (participants.length > 2) {
      // It's a group conversation
      return name;
    } else if (participants.length === 2) {
      // It's a private conversation with 2 people
      if (participants[0].id === userId) {
        return participants[1].username;
      } else {
        return participants[0].username;
      }
    }
  }
};

module.exports = { Conversation };
