import redirect from "../lib/redirect";
import checkLoggedIn from "../lib/checkLoggedIn";
import SignupForm from "../components/SignupForm";

export default class SignupPage extends React.Component {
  constructor(props) {
    super(props);
  }

  static async getInitialProps(context, apolloClient) {
    const { me } = await checkLoggedIn(context.apolloClient);

    if (me) {
      redirect(context, "/");
    }

    return { me };
  }

  render() {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="w-1/3">
          <SignupForm />
        </div>
      </div>
    );
  }
}
