import TextMessage from "./TextMessage";
import AuthenticatedUser from "./AuthenticatedUser";

export default ({ messages }) => (
  <AuthenticatedUser>
    {({ data: { me } }) => (
      <React.Fragment>
        {messages.map(message => (
          <TextMessage
            key={message.id}
            text={message.text}
            author={message.author.username}
            direction={message.author.id === me.id ? "outgoing" : "incoming"}
          />
        ))}
      </React.Fragment>
    )}
  </AuthenticatedUser>
);
