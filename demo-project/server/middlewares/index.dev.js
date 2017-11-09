import path from 'path';
// import webpack from 'webpack';
// import webpackDevMiddleware from 'webpack-dev-middleware';
// import webpackHotMiddleware from 'webpack-hot-middleware';
import express from 'express';
import type {
  $Application,
  $Request,
  $Response
} from 'express';

// import webpackConfig from '../../webpack.config.web.client.dev';

export default function addMiddlewars(app: $Application) {
  // const compiler = webpack(webpackConfig);
  // const middleware = webpackDevMiddleware(compiler, {
  //   noInfo: true,
  //   publicPath: '/assets',
  //   silent: true,
  //   stats: 'errors-only',
  // });
  // app.use(middleware);
  // app.use(webpackHotMiddleware(compiler));

  // // Since webpackDevMiddleware uses memory-fs internally to store build
  // // artifacts, we use it instead
  // const fs = middleware.fileSystem;
  //
  // app.get('*', (req: $Request, res: $Response) => {
  //   fs.readFile(path.join(compiler.outputPath, 'index.html'), (err, file) => {
  //     if (err) {
  //       res.sendStatus(404);
  //     } else {
  //       res.send(file.toString());
  //     }
  //   });
  // });
  app.use(express.static(path.join(__dirname, '../../dist/web/')));
  app.get('*', (req: $Request, res: $Response) => {
    res.sendFile(path.resolve(__dirname, '../../dist/web/index.html'));
  });
}
