/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import RetinaImage from 'react-retina-image';
import electron from 'electron';
import classNames from 'classnames';

import util from '../../utils/Util';
import metrics from '../../utils/MetricsUtil';

const remote = electron.remote;
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;

type HeaderProps = {
  hideLogin: boolean,
  // username: ?string,
  // authorized: boolean,
};
type HeaderState = {
  fullScreen: boolean,
  updateAvailable: boolean,
  username: string,
  verified: boolean,
};
class Header extends React.Component<HeaderProps, HeaderState> {
  getInitialState() {
    return {
      fullScreen: false,
      updateAvailable: false,
      username: 'test', // accountStore.getState().username,
      verified: true, // accountStore.getState().verified
    };
  }
  // componentDidMount() {
  //   document.addEventListener('keyup', this.handleDocumentKeyUp, false);
  //
  //   accountStore.listen(this.update);
  // },
  // componentWillUnmount() {
  //   document.removeEventListener('keyup', this.handleDocumentKeyUp, false);
  //   accountStore.unlisten(this.update);
  // },
  // update() {
  //   const accountState = accountStore.getState();
  //   this.setState({
  //     username: accountState.username,
  //     verified: accountState.verified
  //   });
  // },
  // handleDocumentKeyUp(e) {
  //   if (e.keyCode === 27 && remote.getCurrentWindow().isFullScreen()) {
  //     remote.getCurrentWindow().setFullScreen(false);
  //     this.forceUpdate();
  //   }
  // },

  // eslint-disable-next-line class-methods-use-this
  handleClose() {
    if (util.isWindows()) {
      remote.getCurrentWindow().close();
    } else {
      remote.getCurrentWindow().hide();
    }
  }
  // eslint-disable-next-line class-methods-use-this
  handleMinimize() {
    remote.getCurrentWindow().minimize();
  }
  handleFullScreen() {
    if (util.isWindows()) {
      if (remote.getCurrentWindow().isMaximized()) {
        remote.getCurrentWindow().unmaximize();
      } else {
        remote.getCurrentWindow().maximize();
      }
      this.setState({
        fullScreen: remote.getCurrentWindow().isMaximized()
      });
    } else {
      remote.getCurrentWindow().setFullScreen(!remote.getCurrentWindow().isFullScreen());
      this.setState({
        fullScreen: remote.getCurrentWindow().isFullScreen()
      });
    }
  }
  handleFullScreenHover() {
    this.update();
  }
  handleUserClick(e) {
    const menu = new Menu();

    if (!this.state.verified) {
      menu.append(new MenuItem({
        label: 'I\'ve Verified My Email Address',
        click: this.handleVerifyClick
      }));
    }

    menu.append(new MenuItem({ label: 'Sign Out', click: this.handleLogoutClick }));
    menu.popup(
      remote.getCurrentWindow(),
      e.currentTarget.offsetLeft,
      e.currentTarget.offsetTop + e.currentTarget.clientHeight + 10
    );
  }
  handleLoginClick() {
    this.transitionTo('login');
    metrics.track('Opened Log In Screen');
  }
  // eslint-disable-next-line class-methods-use-this
  handleLogoutClick() {
    metrics.track('Logged Out');
    // accountActions.logout();
  }
  // eslint-disable-next-line class-methods-use-this
  handleVerifyClick() {
    metrics.track('Verified Account', {
      from: 'header'
    });
    // accountActions.verify();
  }
  // eslint-disable-next-line class-methods-use-this
  renderLogo() {
    return (
      <div className="logo">
        <RetinaImage src="logo.png" />
      </div>
    );
  }
  renderWindowButtons() {
    let buttons;
    if (util.isWindows()) {
      buttons = (
        <div className="windows-buttons">
          <div
            className="windows-button button-minimize enabled"
            onClick={this.handleMinimize}
          >
            <div className="icon" />
          </div>
          <div
            className={`windows-button ${this.state.fullScreen
              ? 'button-fullscreenclose'
              : 'button-fullscreen'
            } enabled`}
            onClick={this.handleFullScreen}
          >
            <div className="icon" />
          </div>
          <div
            className="windows-button button-close enabled"
            onClick={this.handleClose}
          />
        </div>
      );
    } else {
      buttons = (
        <div className="buttons">
          <div className="button button-close enabled" onClick={this.handleClose} />
          <div className="button button-minimize enabled" onClick={this.handleMinimize} />
          <div className="button button-fullscreen enabled" onClick={this.handleFullScreen} />
        </div>
      );
    }
    return buttons;
  }
  renderDashboardHeader() {
    const headerClasses = classNames({
      bordered: !this.props.hideLogin,
      header: true,
      'no-drag': true
    });
    let username;
    if (this.props.hideLogin) {
      username = null;
    } else if (this.state.username) {
      username = (
        <div className="login-wrapper">
          <div className="login no-drag" onClick={this.handleUserClick}>
            <span className="icon icon-user" />
            <span className="text">
              {this.state.username}
              {this.state.verified ? null : '(Unverified)'}
            </span>
            <RetinaImage src="userdropdown.png" />
          </div>
        </div>
      );
    } else {
      username = (
        <div className="login-wrapper">
          <div className="login no-drag" onClick={this.handleLoginClick}>
            <span className="icon icon-user" /> LOGIN
          </div>
        </div>
      );
    }
    return (
      <div className={headerClasses}>
        <div className="left-header">
          {util.isWindows() ? this.renderLogo() : this.renderWindowButtons()}
          {username}
        </div>
        <div className="right-header">
          {util.isWindows() ? this.renderWindowButtons() : this.renderLogo()}
        </div>
      </div>
    );
  }
  renderBasicHeader() {
    const headerClasses = classNames({
      bordered: !this.props.hideLogin,
      header: true,
      'no-drag': true
    });
    return (
      <div className={headerClasses}>
        <div className="left-header">
          {util.isWindows() ? null : this.renderWindowButtons()}
        </div>
        <div className="right-header">
          {util.isWindows() ? this.renderWindowButtons() : null}
        </div>
      </div>
    );
  }
  render() {
    if (this.props.hideLogin) {
      return this.renderBasicHeader();
    }
    return this.renderDashboardHeader();
  }
}

export default Header;
