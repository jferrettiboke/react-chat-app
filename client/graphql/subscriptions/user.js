import gql from "graphql-tag";

export default gql`
  subscription onUserAdded {
    user {
      mutation
      node {
        id
        username
      }
    }
  }
`;
