import React from 'react';
import Relay from 'react-relay';
import { browserHistory } from 'react-router';
import auth from '../Auth';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      password: '',
      loggedIn: auth.loggedIn()
    };
  }
  setLoginName(e) {
    this.setState({name: e.target.value});
    this.props.relay.setVariables({name: e.target.value});
  }
  setLoginPassword(e) {
    this.setState({password: e.target.value});
    this.props.relay.setVariables({password: e.target.value});
  }
  componentWillMount() {
    auth.logout();
    this.setState({loggedIn: false});
  }
  login(account){
    const onSuccess = res => {
      auth.login(res.login.token);
      if(this.props.location.state && this.props.location.state.nextPathname) browserHistory.push(this.props.location.state.nextPathname);
      else browserHistory.push('/dashboard');
    };
    const onFailure = (transaction) => {
      var error = transaction.getError() || new Error('Login failed.');
      console.error(error.message);
    };

    account.name = this.state.name;
    account.password = this.state.password;

    Relay.Store.commitUpdate(new LoginMutation(account), {onFailure, onSuccess});
  }
  render() {
    return (
      <div>
        {this.state.loggedIn ? (
          <div>
            <p>You are loggend in.</p>
          </div>
          ) : (
          <div>
            <input type="text" value={this.state.name} onChange={this.setLoginName.bind(this)} />
            <input type="password" value={this.state.password} onChange={this.setLoginPassword.bind(this)} />
            <button onClick={this.login.bind(this, {})}>Login</button>
          </div>
          )
        }
      </div>
    )
  }
}

class LoginMutation extends Relay.Mutation {
  getVariables() {
    return {
      name: this.props.name,
      password: this.props.password,
    };
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        token: this.props.id,
      },
    }];
  }
  getFatQuery() {
    return Relay.QL`
      fragment on LoginPayload {
        token
      }
    `;
  }
  getMutation() {
    return Relay.QL`mutation{login}`;
  }
}

export default Relay.createContainer(Login, {
  fragments: {}
});
