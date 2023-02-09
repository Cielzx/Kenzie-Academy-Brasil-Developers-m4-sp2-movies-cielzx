import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      pagination: {
        page: string | number;
        perPage: string | number;
        prevPage: string | null;
        nextPage: string | null;
        baseUrl: string;
        count: number;
      };
    }
  }
}
