// @flow
import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { renderRoutes } from 'react-router-config';
import { MuiThemeProvider, createMuiTheme } from 'material-ui';
import lightBlue from 'material-ui/colors/lightBlue';
import green from 'material-ui/colors/green';
import red from 'material-ui/colors/red';
import routes from '../routes';

type RootType = {
  store: {},
  history: {}
};

const theme = createMuiTheme({
  palette: {
    primary: lightBlue,
    secondary: green,
  },
  status: {
    danger: red[900]
  },
  mixins: {
    toolbar: {
      minHeight: 48,
    }
  }
});

export default function Root({ store, history }: RootType) {
  return (
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <ConnectedRouter history={history}>
          {renderRoutes(routes)}
        </ConnectedRouter>
      </MuiThemeProvider>
    </Provider>
  );
}
