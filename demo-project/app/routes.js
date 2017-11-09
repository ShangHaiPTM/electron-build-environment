// @flow
import App from './containers/App';
import HomePage from './features/home-page/HomePage';
import CounterPage from './containers/CounterPage';
import ErrorPage from './features/error-page/ErrorPage';

export default [
  {
    component: App,
    routes: [
      {
        path: '/counter',
        component: CounterPage
      },
      {
        path: '/',
        component: HomePage
      },
      // {
      //   path: '/login',
      //   component: LoginPage
      // },
      {
        path: '/error',
        component: ErrorPage
      }
    ]
  }
];
