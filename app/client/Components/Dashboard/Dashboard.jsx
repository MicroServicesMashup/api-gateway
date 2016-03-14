import React from 'react';

export default class Dashboard extends React.Component {
  render() {
    return (
      <div id="container-main">
        <div className="container-fluid margin-after">
          <h1 className="site-title">Dashboard</h1>
        </div>
        {this.props.children}
      </div>
    );
  }
}
