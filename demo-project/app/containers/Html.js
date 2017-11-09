// @flow
import React from 'react';

type HtmlProps = {
  hot: boolean,
  dev: boolean,
  serverPort: number
};

export default class Html extends React.Component<HtmlProps> {
  render() {
    return (
      <html lang="zh-CN">
        <head>
          <meta charSet="utf-8" />
          <title>CFD软件可信性分析工具</title>
          {!this.props.hot && <link rel="stylesheet" href="./dist/style.css" /> }
        </head>
        <body>
          <div id="root" />
          {this.props.dev && <script defer src="../dll/renderer.dev.dll.js" />}
          {this.props.hot
            ? <script
              defer
              src={`http://localhost:${this.props.serverPort}/dist/renderer.dev.js`}
            />
            : <script defer src="./dist/renderer.prod.js" />
          }
        </body>
      </html>
    );
  }
}
