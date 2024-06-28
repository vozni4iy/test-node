declare namespace Express {
  export interface Request {
    decoded?: {
      user?: {
        id: string;
      };
    };
  }
}
