declare module 'browser-sync-middleware' {
  import { RequestHandler } from 'express';
  import { BrowserSyncInstance } from 'browser-sync';

  interface BrowserSyncMiddlewareOptions {
    files?: string | string[];
    logLevel?: 'info' | 'debug' | 'silent';
    reloadDelay?: number;
  }

  function browserSyncMiddleware(
    browserSync: BrowserSyncInstance,
    options?: BrowserSyncMiddlewareOptions
  ): RequestHandler;

  export = browserSyncMiddleware;
}
