import gql from "graphql-tag";

export default gql`
  mutation signup($username: String!) {
    signup(username: $username) {
      token
      user {
        id
        username
      }
    }
  }
`;
