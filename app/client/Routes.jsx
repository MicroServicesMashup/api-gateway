import React from 'react';
import Relay from 'react-relay';
import { Route, IndexRedirect } from 'react-router';

import auth from './Auth';
import Main from './Layout/Main';
import Dashboard from './Components/Dashboard/Dashboard';
import Accounts from './Components/Accounts/Accounts';
import Account from './Components/Accounts/Account';
import Login from './Layout/Login';

function requireAuth(nextState, replace) {
  if (!auth.loggedIn()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    });
  }
}

const StoreQueries = {
  store: () => Relay.QL`query{store}`
};
const AccountQueries = {
  account: () => Relay.QL`query{accountById(id: $id)}`
};

export default (
  <Route path='/' component={Main}>
    <Route path='login' component={Login} />
    <Route path='logout' component={Login} />
    <Route path='dashboard' component={Dashboard} onEnter={requireAuth} />
    <Route path='accounts' component={Accounts} onEnter={requireAuth} queries={StoreQueries} />
    <Route path='accounts/:id' component={Account} onEnter={requireAuth} queries={AccountQueries} />
  </Route>
);
