/* eslint-disable jsx-a11y/no-static-element-interactions */
// @flow

import React from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField/index';
import Checkbox from 'material-ui/Checkbox/index';
import Button from 'material-ui/Button/index';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from 'material-ui/Dialog/index';
import { FormControlLabel, FormGroup } from 'material-ui/Form/index';

import {
  showLoading,
  hideLoading,
} from '../loading/action';

import {
  login
} from '../auth/action';

import { showMessage } from '../message/action';

import type {
  LoginOptions,
  LoginResult
} from '../auth/action';

import type {
  State
} from '../../reducers';

export type PropTypes = {
  shown: boolean,
  onRequestClose: ()=>void,
  login: (options: LoginOptions, callback: (LoginResult)=>void) => void,
  showLoading: ()=>void,
  hideLoading: ()=>void,
  showMessage: typeof showMessage,
}

export type StateTypes = {
  username?: string,
  password?: string,
  rememberMe?: boolean,
}

class Login extends React.Component<PropTypes, StateTypes> {
  state = {
    username: '',
    password: '',
    rememberMe: true,
  };

  handleChange(fieldName: string, event: any) {
    this.setState({
      [fieldName]: event.target.value
    });
  }
  handleRememberMeCheck(event: any) {
    this.setState({
      rememberMe: event.target.checked
    });
  }
  handleLogin() {
    this.props.showLoading();
    this.props.login({
      username: this.state.username || '',
      password: this.state.password || '',
      rememberMe: !!this.state.rememberMe,
    }, (result: LoginResult) => {
      this.props.hideLoading();
      if (result.success) {
        this.props.onRequestClose();
      } else {
        this.props.showMessage({
          message: result.err || '未知错误，无法登陆。'
        });
      }
    });
  }

  handleEnterKey(event: *) {
    if (event.key === 'Enter') {
      this.handleLogin();
      event.preventDefault();
    }
  }

  render() {
    return (
      <Dialog
        title="登录"
        maxWidth="xs"
        open={this.props.shown}
        onRequestClose={this.props.onRequestClose}
      >
        <DialogTitle>登录</DialogTitle>
        <DialogContent onKeyPress={this.handleEnterKey.bind(this)}>
          <TextField
            value={this.state.username}
            onChange={this.handleChange.bind(this, 'username')}
            label="用户名"
            margin="normal"
            autoFocus
            fullWidth
          />
          <TextField
            value={this.state.password}
            onChange={this.handleChange.bind(this, 'password')}
            label="密码"
            type="password"
            margin="normal"
            fullWidth
          />
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.rememberMe}
                  onChange={this.handleRememberMeCheck.bind(this)}
                />
              }
              label="记住我"
            />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            onClick={this.handleLogin.bind(this)}
          >登录</Button>,
          <Button
            onClick={this.props.onRequestClose}
          >取消</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

function mapState(state: State) {
  return {
    shown: state.loginPage.shown
  };
}

const mapDispatch = {
  showLoading,
  hideLoading,
  showMessage,
  login
};

export default connect(mapState, mapDispatch)(Login);
