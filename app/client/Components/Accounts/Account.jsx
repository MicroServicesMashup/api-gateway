import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';

class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.account.id,
      name: this.props.account.name,
      email: this.props.account.email,
      password: this.props.account.password,
    };
  }
  setAccountName(e) {
    this.setState({name: e.target.value});
    this.props.relay.setVariables({name: e.target.value});
  };
  setAccountEMail(e) {
    this.setState({email: e.target.value});
    this.props.relay.setVariables({email: e.target.value});
  };
  setAccountPassword(e) {
    this.setState({password: e.target.value});
    this.props.relay.setVariables({password: e.target.value});
  };
  upsertAccount(account){
    var onSuccess = (response) => {
      console.log('success');
    };
    var onFailure = (transaction) => {
      var error = transaction.getError() || new Error('failed');
      console.error(error.message);
    };
    account.id = this.state.id;
    account.email = this.state.email;
    account.name = this.state.name;
    account.password = this.state.password;

    Relay.Store.commitUpdate(new UpsertAccountMutation(account), {onFailure, onSuccess});
  };
  render() {
    return (
      <div id="container-main">
        <div className="container-fluid margin-after">
          <h1 className="site-title">Account</h1>
          <input type="text" value={this.state.email} onChange={this.setAccountEMail.bind(this)} />
          <input type="text" value={this.state.name} onChange={this.setAccountName.bind(this)} />
          <input type="text" value={this.state.password} onChange={this.setAccountPassword.bind(this)} />
          <button onClick={this.upsertAccount.bind(this, {})}>Save</button>
        </div>
      </div>
    );
  }
}

class UpsertAccountMutation extends Relay.Mutation {
  getVariables() {
    return {
      id: this.props.id,
      email: this.props.email,
      name: this.props.name,
      password: this.props.password,
    };
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        account: this.props.id,
      }
    }];
  }
  getFatQuery() {
    return Relay.QL`
      fragment on UpsertAccountPayload {
        account {
          id
          email
          name
          password
        }
      }
    `;
  }
  getMutation() {
    return Relay.QL`mutation{upsertAccount}`;
  }
}

export default Relay.createContainer(Account, {
  fragments: {
    account: () => Relay.QL`
      fragment on Account {
        id
        email
        name
        password
      }
    `
  }
});
