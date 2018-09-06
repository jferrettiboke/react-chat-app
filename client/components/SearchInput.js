export default class SearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { input: "" };
  }

  render() {
    return (
      <input
        type="text"
        className="block w-full h-full p-4 outline-none"
        placeholder="Search..."
        onChange={e => {
          const { value } = e.target;
          this.setState({ input: value });
          this.props.onChange(value);
        }}
        value={this.state.input}
      />
    );
  }
}
