const jwt = require("jsonwebtoken");
const APP_SECRET = "appsecret123";

const Mutation = {
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
  async createConversation(
    { userId },
    { name, participantIds, text },
    context,
    info
  ) {
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
  async sendTextMessage({ userId }, { conversationId, text }, context, info) {
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
};

module.exports = { Mutation };
