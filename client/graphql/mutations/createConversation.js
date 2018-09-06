import gql from "graphql-tag";

export default gql`
  mutation createConversation(
    $name: String
    $participantIds: [ID!]!
    $text: String
  ) {
    createConversation(
      name: $name
      participantIds: $participantIds
      text: $text
    ) {
      id
      name
      participants {
        id
        username
      }
      texts {
        id
        text
        createdAt
        author {
          id
          username
        }
      }
    }
  }
`;
