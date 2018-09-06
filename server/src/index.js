const { GraphQLServer } = require("graphql-yoga");
const { Prisma } = require("prisma-binding");
const jwt = require("jsonwebtoken");

const APP_SECRET = "appsecret123";

function getUserId(context) {
  const Authorization = context.request.get("Authorization");

  if (Authorization) {
    const token = Authorization.replace("Bearer ", "");
    const { userId } = jwt.verify(token, APP_SECRET);

    return userId;
  }

  throw new AuthError();
}

class AuthError extends Error {
  constructor() {
    super("Not authorized");
  }
}

const resolvers = {
  Query: {
    async users(_, args, context, info) {
      const userId = getUserId(context);

      return await context.prisma.query.users(
        { where: { id_not: userId } },
        info
      );
    },
    async me(_, args, context, info) {
      const userId = getUserId(context);

      return await context.prisma.query.user({ where: { id: userId } }, info);
    }
  },
  Mutation: {
    async signup(_, { username }, context, info) {
      const user = await context.prisma.mutation.createUser(
        {
          data: {
            username
          }
        },
        `{ id }`
      );

      return {
        token: jwt.sign({ userId: user.id }, APP_SECRET),
        user
      };
    },
    async createConversation(_, { name, participantIds, text }, context, info) {
      const userId = getUserId(context);

      let allParticipantIds = participantIds;
      allParticipantIds.push(userId);

      const data = {
        name,
        participants: {
          connect: allParticipantIds.map(participantId => ({
            id: participantId
          }))
        }
      };

      if (text) {
        data.texts = {
          create: {
            text,
            author: {
              connect: {
                id: userId
              }
            }
          }
        };
      }

      return await context.prisma.mutation.createConversation({ data }, info);
    },
    async sendTextMessage(_, { conversationId, text }, context, info) {
      const userId = getUserId(context);

      return await context.prisma.mutation.createText(
        {
          data: {
            text,
            author: {
              connect: {
                id: userId
              }
            },
            conversation: {
              connect: {
                id: conversationId
              }
            }
          }
        },
        info
      );
    }
  },
  Subscription: {
    user: {
      async subscribe(parent, args, context, info) {
        return await context.prisma.subscription.user({}, info);
      }
    },
    text: {
      async subscribe(parent, args, context, info) {
        return await context.prisma.subscription.text({}, info);
      }
    }
  },
  AuthPayload: {
    user: async ({ user: { id } }, args, context, info) => {
      return await context.prisma.query.user({ where: { id } }, info);
    }
  },
  Conversation: {
    name(parent, args, context, info) {
      const { name, participants } = parent;
      const userId = getUserId(context);

      if (participants.length === 2) {
        if (participants[0].id === userId) {
          return participants[1].username;
        } else {
          return participants[0].username;
        }
      } else {
        return name;
      }
    }
  }
};

const server = new GraphQLServer({
  typeDefs: "src/schema.graphql",
  resolvers,
  context: req => ({
    ...req,
    prisma: new Prisma({
      typeDefs: "src/generated/prisma.graphql",
      endpoint: "https://eu1.prisma.sh/chat-app/chat-app/dev"
    })
  })
});

server.start(() =>
  console.log(`GraphQL server is running on http://localhost:4000`)
);
