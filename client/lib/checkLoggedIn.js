import gql from "graphql-tag";

export default apolloClient =>
  apolloClient
    .query({
      query: gql`
        query me {
          me {
            id
            username
          }
        }
      `
    })
    .then(({ data }) => {
      return { me: data.me };
    })
    .catch(() => {
      // Fail gracefully
      return { me: null };
    });
