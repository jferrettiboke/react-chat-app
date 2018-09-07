const Conversation = {
  name({ name, participants, userId }, args, context, info) {
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
