import gql from "graphql-tag";

export default gql`
  subscription onTextAdded {
    text {
      mutation
      node {
        id
        text
        createdAt
        author {
          id
          username
        }
        conversation {
          id
          # name
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
  }
`;
