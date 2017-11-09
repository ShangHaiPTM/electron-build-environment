// @flow
import React from 'react';
import type { Element } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Popover,
  PopoverAnimationVertical,
  MenuList,
  MenuItem,
} from 'material-ui';

import { logout } from '../auth/action';
import { showLoading, hideLoading } from '../loading/action';
import { showLogin, closeLogin } from '../login-page/action';
import type { State } from '../../reducers/index';
import Login from '../login-page/Login';

type HeaderState = {
  menuShown?: boolean,
  menuAnchorElement?: Element<typeof Button>,
}

type HeaderProps = {
  authorized: boolean,
  username?: string,
  showLoading: ()=>void,
  hideLoading: ()=>void,
  showLogin: ()=>void,
  closeLogin: ()=>void,
  logout: (()=>void)=>void,
}

class UserMenu extends React.Component<HeaderProps, HeaderState> {
  state = {
    loginShown: false,
    menuShown: false,
    menuAnchorElement: undefined,
  };

  handleShowMenu(event) {
    this.setState({
      menuShown: true,
      menuAnchorElement: event.currentTarget
    });
  }

  handleHideMenu() {
    this.setState({
      menuShown: false
    });
  }

  handleLogout() {
    this.props.showLoading();
    this.props.logout(() => {
      this.handleHideMenu();
      this.props.hideLoading();
    });
  }

  renderLogin() {
    return (
      <div>
        <Button color="secondary" onClick={this.props.showLogin}>
          登录
        </Button>
        <Login onRequestClose={this.props.closeLogin} />
      </div>
    );
  }
  renderUserMenu() {
    return (
      <div>
        <Button onClick={this.handleShowMenu.bind(this)}>
          {this.props.username}
        </Button>
        <Popover
          open={this.state.menuShown}
          anchorEl={this.state.menuAnchorElement}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          onRequestClose={this.handleHideMenu.bind(this)}
          animation={PopoverAnimationVertical}
        >
          <MenuList>
            <MenuItem>设置</MenuItem>
            <MenuItem onClick={this.handleLogout.bind(this)}>登出</MenuItem>
          </MenuList>
        </Popover>
      </div>
    );
  }
  render() {
    return this.props.authorized ? this.renderUserMenu() : this.renderLogin();
  }
}

function mapState(state: State) {
  return {
    authorized: state.authorize.authorized,
    username: state.authorize.user && state.authorize.user.name,
  };
}

const mapDispatch = {
  logout,
  showLoading,
  hideLoading,
  showLogin,
  closeLogin,
};

export default connect(mapState, mapDispatch)(UserMenu);
