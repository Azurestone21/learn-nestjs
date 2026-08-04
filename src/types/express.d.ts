declare global {
  namespace Express {
    interface Request {
      user?: {
        roles?: string[];
      };
    }
  }
}
export {};
