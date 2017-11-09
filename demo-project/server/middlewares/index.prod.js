import path from 'path';
import express from 'express';
import type {
  $Application,
  $Request,
  $Response
} from 'express';

export default function addMiddlewars(app: $Application) {
  app.use(express.static(path.join(__dirname, '../dist/web/')));
  app.get('*', (req: $Request, res: $Response) => {
    res.sendFile(path.resolve(__dirname, '../dist/web/index.html'));
  });
}
