import React from "react";
import { Query, Mutation } from "react-apollo";
import moment from "moment";

import redirect from "../lib/redirect";
import checkLoggedIn from "../lib/checkLoggedIn";
import AuthenticatedUser from "../components/AuthenticatedUser";
import Avatar from "../components/ui/Avatar";
import Footer from "../components/Footer";
import SearchInput from "../components/SearchInput";
import ConversationList from "../components/ConversationList";
import UserList from "../components/UserList";
import Conversation from "../components/Conversation";
import randomEmoji from "../utils/randomEmoji";
import MY_CONVERSATIONS_QUERY from "../graphql/queries/myConversations";
import USERS_QUERY from "../graphql/queries/users";
import CREATE_CONVERSATION_MUTATION from "../graphql/mutations/createConversation";
import SEND_TEXT_MESSAGE_MUTATION from "../graphql/mutations/sendTextMessage";
import TEXT_ADDED_SUBSCRIPTION from "../graphql/subscriptions/text";
import USER_ADDED_SUBSCRIPTION from "../graphql/subscriptions/user";

const contexts = {
  CONVERSATION: "CONVERSATION",
  USER: "USER"
};

export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: "",
      context: {
        name: null,
        id: null,
        data: {}
      }
    };
  }

  static async getInitialProps(context, apolloClient) {
    const { me } = await checkLoggedIn(context.apolloClient);

    if (!me) {
      // If not signed in, send them somewhere more useful
      redirect(context, "/signup");
    }

    return { me };
  }

  renderConversationList() {
    return (
      <Query query={MY_CONVERSATIONS_QUERY}>
        {({ loading, error, data, subscribeToMore }) => (
          <ConversationList
            onClick={conversation => {
              this.setState(prevState => ({
                ...prevState,
                context: {
                  name: contexts.CONVERSATION,
                  id: conversation.id,
                  data: conversation
                }
              }));
            }}
            {...{
              loading,
              error,
              conversations: data.me.conversations.filter(
                conversation =>
                  this.state.searchInput !== ""
                    ? conversation.name
                        .toUpperCase()
                        .includes(this.state.searchInput.toUpperCase())
                    : conversation
              )
            }}
            subscribeToNewConversationMessages={() =>
              subscribeToMore({
                document: TEXT_ADDED_SUBSCRIPTION,
                variables: {},
                updateQuery: (prev, { subscriptionData }) => {
                  if (!subscriptionData.data) return prev;

                  const newText = subscriptionData.data.text.node;
                  const conversationExists = prev.me.conversations.find(
                    conversation => conversation.id === newText.conversation.id
                  );

                  if (conversationExists) {
                    // It is a new chat from subscription and it is not in prev query.
                    const conversations = prev.me.conversations.map(
                      conversation => {
                        if (conversation.id === conversationExists.id) {
                          const { conversation: x, ...newTextObj } = newText;
                          return {
                            ...conversation,
                            texts: [...conversation.texts, newTextObj]
                          };
                        }

                        return conversation;
                      }
                    );

                    return {
                      ...prev,
                      me: {
                        ...prev.me,
                        conversations
                      }
                    };
                  }
                }
              })
            }
          />
        )}
      </Query>
    );
  }

  renderUserList() {
    return (
      <Query query={USERS_QUERY}>
        {({ loading, error, data, subscribeToMore }) => (
          <UserList
            onClick={user => {
              this.setState(prevState => ({
                ...prevState,
                context: { name: contexts.USER, id: user.id, data: user }
              }));
            }}
            {...{
              loading,
              error,
              users: data.users.filter(
                user =>
                  this.state.searchInput !== ""
                    ? user.username
                        .toUpperCase()
                        .includes(this.state.searchInput.toUpperCase())
                    : user
              )
            }}
            subscribeToNewUsers={() =>
              subscribeToMore({
                document: USER_ADDED_SUBSCRIPTION,
                variables: {},
                updateQuery: (prev, { subscriptionData }) => {
                  if (!subscriptionData.data) return prev;

                  const newUser = subscriptionData.data.user.node;

                  return {
                    ...prev,
                    users: [...prev.users, newUser]
                  };
                }
              })
            }
          />
        )}
      </Query>
    );
  }

  renderTextMessageList() {
    return (
      <Query query={MY_CONVERSATIONS_QUERY}>
        {({ loading, error, data }) => {
          const conversations = data.me.conversations.map(conversation => {
            return {
              ...conversation,
              texts: conversation.texts.filter(
                textMessage =>
                  this.state.searchInput !== ""
                    ? textMessage.text
                        .toUpperCase()
                        .includes(this.state.searchInput.toUpperCase())
                    : false
              )
            };
          });

          return (
            <ul
              className={[
                "list-reset",
                this.state.searchInput === "" && "hidden"
              ].join(" ")}
            >
              <li className="font-bold m-4">Messages</li>
              {conversations.map(conversation => (
                <React.Fragment key={conversation.id}>
                  {conversation.texts.map(textMessage => (
                    <li
                      key={textMessage.id}
                      className="px-4 py-2 hover:bg-grey-lightest cursor-pointer flex items-center"
                      onClick={e => {
                        this.setState(prevState => ({
                          ...prevState,
                          context: {
                            name: contexts.CONVERSATION,
                            id: conversation.id,
                            data: conversation
                          }
                        }));
                      }}
                    >
                      <div className="mr-3">
                        <Avatar initials={conversation.name} />
                      </div>
                      <div className="text-sm flex-1">
                        <div className="font-bold">{conversation.name}</div>
                        <div className="flex justify-between text-grey-dark">
                          <div
                            className="mt-1 w-32 overflow-hidden whitespace-no-wrap"
                            style={{
                              textOverflow: "ellipsis"
                            }}
                          >
                            <AuthenticatedUser>
                              {({ isAuthenticated, data: { me } }) => {
                                const author =
                                  isAuthenticated &&
                                  me.id === textMessage.author.id
                                    ? "You"
                                    : textMessage.author.username;
                                return (
                                  <span>
                                    {author}: {textMessage.text}
                                  </span>
                                );
                              }}
                            </AuthenticatedUser>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-grey-dark">
                        {moment(textMessage.createdAt).fromNow()}
                      </div>
                    </li>
                  ))}
                </React.Fragment>
              ))}
            </ul>
          );
        }}
      </Query>
    );
  }

  renderConversationNotSelected() {
    return (
      <div className="flex-1 flex flex-col h-full items-center justify-center">
        <div className="text-5xl">{randomEmoji()}</div>
        <div className="mt-6">Coding is awesome!</div>
      </div>
    );
  }

  renderConversations() {
    const { context } = this.state;
    return (
      <Mutation mutation={SEND_TEXT_MESSAGE_MUTATION}>
        {(sendTextMessage, { loading, error, data }) => (
          <Query query={MY_CONVERSATIONS_QUERY}>
            {({ loading, error, data }) => (
              <React.Fragment>
                {data.me.conversations.map(conversation => (
                  <div
                    key={conversation.id}
                    className={[
                      "h-full",
                      context.name === contexts.CONVERSATION &&
                      context.id === conversation.id
                        ? "block"
                        : "hidden"
                    ].join(" ")}
                  >
                    <Conversation
                      conversation={conversation}
                      onTextMessageSend={text => {
                        sendTextMessage({
                          variables: {
                            conversationId: conversation.id,
                            text
                          }
                        });
                      }}
                    />
                  </div>
                ))}
              </React.Fragment>
            )}
          </Query>
        )}
      </Mutation>
    );
  }

  renderWindowsFromContext({ me }) {
    let renderWindow;
    const { context } = this.state;

    if (!context.name) {
      renderWindow = this.renderConversationNotSelected();
    }

    if (context.name === contexts.USER) {
      const conversationExists = me.conversations.find(
        conversation =>
          conversation.participants.length === 2 &&
          conversation.participants.find(
            participant => participant.id === context.id
          )
      );

      if (conversationExists) {
        this.setState(prevState => ({
          ...prevState,
          context: {
            name: contexts.CONVERSATION,
            id: conversationExists.id,
            data: conversationExists
          }
        }));
      } else {
        renderWindow = (
          <Mutation mutation={CREATE_CONVERSATION_MUTATION}>
            {(createConversation, { loading, error, data }) => (
              <Conversation
                conversation={{
                  id: null,
                  name: context.data.username,
                  participants: [],
                  texts: []
                }}
                onTextMessageSend={text => {
                  createConversation({
                    variables: {
                      name: null,
                      participantIds: [context.id],
                      text
                    }
                  }).then(({ data }) => {
                    this.setState(prevState => ({
                      ...prevState,
                      context: {
                        name: contexts.CONVERSATION,
                        id: data.createConversation.id,
                        data: data.createConversation
                      }
                    }));
                  });
                }}
              />
            )}
          </Mutation>
        );
      }
    }

    return (
      <React.Fragment>
        {renderWindow}
        {this.renderConversations()}
      </React.Fragment>
    );
  }

  render() {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <AuthenticatedUser>
          {({ isAuthenticated, logout, data: { me } }) => (
            <React.Fragment>
              <header className="my-16 w-full">
                {isAuthenticated ? (
                  <div className="text-center">
                    <div className="flex flex-col items-center text-grey">
                      Logged in as {me.username}
                    </div>
                    <a
                      className="block text-black mt-2"
                      href="#"
                      onClick={e => {
                        e.preventDefault();
                        logout();
                      }}
                    >
                      Logout
                    </a>
                  </div>
                ) : (
                  <Signup />
                )}
              </header>

              {isAuthenticated && (
                <div
                  className="w-2/3 rounded border flex bg-white overflow-hidden"
                  style={{ height: 500 }}
                >
                  <div id="leftTile" className="w-1/3 border-r flex flex-col">
                    <div id="search" className="h-16 border-b">
                      <SearchInput
                        onChange={searchInput => {
                          this.setState(prevState => ({
                            ...prevState,
                            searchInput
                          }));
                        }}
                      />
                    </div>
                    <div className="flex-1 overflow-y-scroll scrolling-touch py-2">
                      {this.renderConversationList()}
                      {this.renderUserList()}
                      {this.renderTextMessageList()}
                    </div>
                  </div>
                  <div id="rightTile" className="w-2/3">
                    <Query query={MY_CONVERSATIONS_QUERY}>
                      {({ loading, error, data }) =>
                        this.renderWindowsFromContext({ me: data.me })
                      }
                    </Query>
                  </div>
                </div>
              )}

              <Footer />
            </React.Fragment>
          )}
        </AuthenticatedUser>
      </div>
    );
  }
}
