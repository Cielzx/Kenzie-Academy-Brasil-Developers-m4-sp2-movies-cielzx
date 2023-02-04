import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      pagination: {
        prevPage: string | null;
        nextPage: string | null;
        baseUrl: string;
        count: number;
      };
    }
  }
}
