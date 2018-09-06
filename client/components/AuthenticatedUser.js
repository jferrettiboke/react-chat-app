import gql from "graphql-tag";
import { Query, ApolloConsumer } from "react-apollo";
import cookie from "cookie";

import redirect from "../lib/redirect";

const ME = gql`
  query me {
    me {
      id
      username
    }
  }
`;

const AuthenticatedUser = ({ children }) => {
  const logout = apolloClient => {
    document.cookie = cookie.serialize("token", "", {
      maxAge: -1 // Expire the cookie immediately
    });

    // Force a reload of all the current queries now that the user is
    // logged in, so we don't accidentally leave any state around.
    apolloClient.cache.reset().then(() => {
      // Redirect to a more useful page when signed out
      redirect({}, "/");
    });
  };

  return (
    <ApolloConsumer>
      {client => (
        <Query query={ME}>
          {({ loading, error, data }) => (
            <React.Fragment>
              {children({
                isAuthenticated: !loading && !error && data,
                logout: () => logout(client),
                loading,
                error,
                data
              })}
            </React.Fragment>
          )}
        </Query>
      )}
    </ApolloConsumer>
  );
};

export default AuthenticatedUser;
