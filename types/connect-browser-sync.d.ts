declare module 'connect-browser-sync' {
  import { RequestHandler } from 'express';
  import { BrowserSyncInstance } from 'browser-sync';

  function connectBrowserSync(browserSync: BrowserSyncInstance): RequestHandler;

  export = connectBrowserSync;
}
