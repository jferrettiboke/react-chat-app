import gql from "graphql-tag";

export default gql`
  mutation sendTextMessage($conversationId: ID!, $text: String!) {
    sendTextMessage(conversationId: $conversationId, text: $text) {
      id
      text
    }
  }
`;
