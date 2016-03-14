import React from 'react';
import { render } from 'react-dom';
import { RelayRouter } from 'react-router-relay';
import { browserHistory } from 'react-router';

import Routes from './Routes';

render(
  <RelayRouter history={browserHistory} routes={Routes} />,
  document.getElementById('render_body')
);
