const Subscription = {
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
};

module.exports = { Subscription };
