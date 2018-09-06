import gql from "graphql-tag";

export default gql`
  {
    users {
      id
      username
    }
  }
`;
