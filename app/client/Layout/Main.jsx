import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import auth from '../Auth';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loggedIn: auth.loggedIn() };
  }
  updateAuth(loggedIn) {
    this.setState({ loggedIn: loggedIn });
  }
  componentWillMount() {
    auth.onChange = this.updateAuth.bind(this);
    auth.login();
  }
  render() {
    return (
      <div>
        <ul>
          <li>
            {this.state.loggedIn ? (
              <Link to="/logout">Log out</Link>
            ) : (
              <Link to="/login">Sign in</Link>
            )}
          </li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/accounts">Accounts</Link></li>
        </ul>
        {this.props.children || <p>You are {!this.state.loggedIn && 'not'} logged in.</p>}
      </div>
    )
  }
}

export default Relay.createContainer(App, {
  fragments: {}
});
