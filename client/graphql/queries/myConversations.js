import gql from "graphql-tag";

export default gql`
  {
    me {
      id
      conversations {
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
  }
`;
