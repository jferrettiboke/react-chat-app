import React from "react";
import App, { Container } from "next/app";
import { ApolloProvider } from "react-apollo";
import withApollo from "../lib/withApollo";

class MyApp extends App {
  render() {
    const { Component, pageProps, apolloClient } = this.props;

    return (
      <Container>
        <ApolloProvider client={apolloClient}>
          <Component {...pageProps} />
        </ApolloProvider>
        <style jsx global>{`
          .gradient-primary {
            background-image: linear-gradient(60deg, #29323c 0%, #485563 100%);
          }
        `}</style>
      </Container>
    );
  }
}

export default withApollo(MyApp);
