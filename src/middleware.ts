import { json, NextFunction, Request, Response } from "express";
import { QueryConfig } from "pg";
import format from "pg-format";
import { client } from "./dataBase";
import { iMoviesRequest, iPagination, movieQueryResult } from "./interface";

const verifyName = async (req: Request, res: Response, next: NextFunction) => {
  const query: string = `
    SELECT
         *
    FROM
        movies_table;
    `;

  const queryResult: movieQueryResult = await client.query(query);

  const filter = queryResult.rows.find((el) => el.name === req.body.name);

  if (filter) {
    return res.status(409).json({ message: "Movie already exists." });
  }

  next();
};

const verifyMovies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const query: string = `
    SELECT
         *
    FROM
        movies_table;
    `;

  const queryResult: movieQueryResult = await client.query(query);

  const filter = queryResult.rows.filter((el) => el.id === +id);

  if (!filter) {
    return res.status(409).json({ message: "Movie not found " });
  }

  next();
};

const paginateFunction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const page = Number(req.query.page);
  const perPage = Number(req.query.perPage);
  const sort: string = String(req.query.sort);
  let order: string = String(req.query.order);

  const object = {
    page: page,
    perPage: perPage,
    sort: sort,
  };

  const baseUrl: string = `localhost:3000/movie_data/`;

  let prevPage: string | null = `${baseUrl}?page=${
    page - 1
  }&perPage=${perPage}`;

  let nextPage: string | null = `${baseUrl}?page=${
    page + 1
  }&perPage=${perPage}`;
  const count = +perPage;

  if (page <= 1) {
    prevPage = null;
  }

  if (page >= 5) {
    nextPage = null;
  }

  req.pagination = {
    prevPage: prevPage,
    nextPage: nextPage,
    baseUrl: baseUrl,
    count: count,
  };

  if (!sort) {
    const query: string = `
    SELECT 
        *
    FROM
        movies_table
    `;

    const queryConfig: QueryConfig = {
      text: query,
      // values: [perPage, page],
    };

    const queryResult: movieQueryResult = await client.query(queryConfig);

    const pagination: iPagination = {
      prevPage,
      nextPage,
      count,
      data: queryResult.rows,
    };

    return res.status(200).json(pagination);
  }

  next();
};

export { verifyName, verifyMovies, paginateFunction };
