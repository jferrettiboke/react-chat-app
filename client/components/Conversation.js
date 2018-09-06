import MessageList from "./MessageList";
import Avatar from "./ui/Avatar";

export default class Conversation extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: "" };
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  };

  renderConversationHeader() {
    const { conversation } = this.props;

    return (
      <header className="h-16 border-b p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Avatar className="mr-4" initials={conversation.name} size="large" />
          <div className="font-bold">{conversation.name}</div>
        </div>
        <div className="flex">
          {conversation.participants.map(participant => (
            <Avatar
              key={participant.id}
              initials={participant.username}
              style={{ marginRight: -7 }}
            />
          ))}
        </div>
      </header>
    );
  }

  renderConversationBody() {
    const { conversation } = this.props;

    return (
      <div className="flex-1 p-4 overflow-y-scroll scrolling-touch">
        <MessageList messages={conversation.texts} />
        <div
          ref={el => {
            this.messagesEnd = el;
          }}
        />
      </div>
    );
  }

  renderConversationFooter = () => {
    const { onTextMessageSend } = this.props;

    return (
      <footer className="h-16 border-t">
        <form className="h-full" onSubmit={e => e.preventDefault()}>
          <input
            type="text"
            className="block w-full h-full p-4 outline-none"
            placeholder="Type something..."
            value={this.state.text}
            onChange={e => this.setState({ text: e.target.value })}
            onKeyPress={e => {
              const text = e.target.value;
              if (e.key === "Enter" && text !== "") {
                e.preventDefault();
                onTextMessageSend && onTextMessageSend(text);
                this.setState({ text: "" });
              }
            }}
          />
        </form>
      </footer>
    );
  };

  render() {
    return (
      <div className="flex flex-col h-full">
        {this.renderConversationHeader()}
        {this.renderConversationBody()}
        {this.renderConversationFooter()}
      </div>
    );
  }
}
