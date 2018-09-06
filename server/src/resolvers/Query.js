const Query = {
  async users({ userId }, args, context, info) {
    return await context.prisma.query.users(
      { where: { id_not: userId } },
      info
    );
  },
  async me({ userId }, args, context, info) {
    return await context.prisma.query.user({ where: { id: userId } }, info);
  }
};

module.exports = { Query };
