const AuthPayload = {
  user: async ({ user: { id } }, args, context, info) => {
    return await context.prisma.query.user({ where: { id } }, info);
  }
};

module.exports = { AuthPayload };
