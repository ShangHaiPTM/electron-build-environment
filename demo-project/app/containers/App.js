// @flow
import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { renderRoutes } from 'react-router-config';

import Header from '../features/header/Header';
import LoadingMask from '../features/loading/LoadingMask';
import Messages from '../features/message/Messages';
import type { State } from '../reducers/index';

export type AppProps = {
  route: any,
  location: any,
  authorized: boolean,
};

const nonAuthorizeUrls = [
  /^\/$/,
  /^\/login\/?$/,
];

class App extends Component<AppProps> {
  render() {
    let allowAccess = this.props.authorized;
    if (!allowAccess) {
      allowAccess = !!_.find(
        nonAuthorizeUrls,
        (match: RegExp) => match.test(this.props.location.pathname)
      );
    }
    if (allowAccess) {
      return (
        <div>
          <Header />
          {renderRoutes(this.props.route.routes)}
          <LoadingMask />
          <Messages />
        </div>
      );
    }
    return (
      <Redirect to={{
        pathname: '/login',
        state: { from: this.props.location }
      }}
      />
    );
  }
}

function mapState(state: State): $Supertype<AppProps> {
  return {
    authorized: state.authorize.authorized
  };
}

export default connect(mapState)(App);
