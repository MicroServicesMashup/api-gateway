import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';

class Accounts extends React.Component {
  render() {
    return (
      <div id="container-main">
        <div className="container-fluid margin-after">
          <h1 className="site-title">Accounts</h1>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th className="text-center">E-Mail</th>
                <th className="text-center">Name</th>
                <th className="text-center">Password</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {this.props.store.accounts.map((account, i) => {
                return (
                  <tr key={i}>
                    <td className="text-center"><Link to={`/accounts/${account.id}`}>{account.email}</Link></td>
                    <td className="text-center">{account.name}</td>
                    <td className="text-center">{account.password}</td>
                    <td className="text-center"><button className="btn btn-block">{account.id}</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(Accounts, {
  fragments: {
    store: () => Relay.QL`
      fragment on Store {
        accounts {
          id
          email
          name
          password
        }
      }
    `
  }
});
