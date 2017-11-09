import React from 'react';
import s from './ErrorPage.css';

type ErrorPageProps = {
  message?: string,
  backUrl?: string
};

export default class ErrorPage extends React.Component<ErrorPageProps> {
  static defaultProps : ErrorPageProps = {
    message: '未知错误！',
    // eslint-disable-next-line no-script-url
    backUrl: 'javascript:navigator.back();'
  };

  // If the class only have 'render' method, babel will crash.
  fake() {
    this.render();
  }

  render() {
    const { message, backUrl } = this.props;

    return (
      <div className={s.container}>
        <div className={s.content}>
          {message}
        </div>
        <a href={backUrl}>返回</a>
      </div>
    );
  }
}
