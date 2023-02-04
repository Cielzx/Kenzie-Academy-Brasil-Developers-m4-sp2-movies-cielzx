import { Request, Response } from "express";
import { QueryConfig } from "pg";
import format, { string } from "pg-format";
import { client } from "./dataBase";
import {
  idMovies,
  iMoviesRequest,
  iPagination,
  movieQueryResult,
} from "./interface";

const createMovies = async (req: Request, res: Response): Promise<Response> => {
  const movieDataRequest: iMoviesRequest = req.body;

  // const movieData = {
  //     id:
  //     ...movieDataRequest
  // }

  const queryStr: string = `
  INSERT INTO
    movies_table(name,description,duration,price)
  VALUES
  ($1, $2, $3, $4)
  RETURNING *;
  `;
  const queryConfig: QueryConfig = {
    text: queryStr,
    values: Object.values(movieDataRequest),
  };

  const queryResult: movieQueryResult = await client.query(queryConfig);
  const newMovieData: idMovies = queryResult.rows[0];
  console.log(queryResult);

  return res.status(201).json(newMovieData);
};

const createMoviesFormat = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const movieDataRequest: iMoviesRequest = req.body;

  const queryStr: string = format(
    `
    INSERT INTO
      movies_table(%I)
    VALUES
    (%L)
    RETURNING *;
    `,
    Object.keys(movieDataRequest),
    Object.values(movieDataRequest)
  );

  const queryResult: movieQueryResult = await client.query(queryStr);
  const newMovieData: idMovies = queryResult.rows[0];

  return res.status(201).json(newMovieData);
};

const listMovies = async (req: Request, res: Response): Promise<Response> => {
  let perPage: any = Number(req.query.perPage);
  let page: any = req.query.page != "string" ? 1 : Number(req.query.page);
  const sort: string = String(req.query.sort);
  let order: string = String(req.query.order);

  if (perPage < 1 || perPage > 5 || typeof perPage != "number") {
    perPage = 5;
  }

  if (page <= 0 || typeof page != "number") {
    page = 1;
  }

  const object = {
    page: page,
    perPage: perPage,
    sort: sort,
  };

  const query =
    order == "DESC"
      ? format(
          `
    SELECT
         *
    FROM
        movies_table
    ORDER BY
        ${sort} DESC
      LIMIT $1 OFFSET $2;
      
    `,
          Object.values(object)
        )
      : format(
          `
        SELECT
        *
   FROM
       movies_table
   ORDER BY
       ${sort} ASC
       LIMIT $1 OFFSET $2;
        `,
          Object.values(object)
        );

  const queryConfig: QueryConfig = {
    text: query,
    values: [perPage, page],
  };

  const queryResult: movieQueryResult = await client.query(queryConfig);

  let prevPage = req.pagination.prevPage;
  let nextPage = req.pagination.nextPage;
  let count = req.pagination.count;

  const pagination: iPagination = {
    prevPage,
    nextPage,
    count,
    data: queryResult.rows,
  };

  return res.status(200).json(pagination);
};

const updateMovie = async (req: Request, res: Response): Promise<Response> => {
  const id: number = +req.params.id;
  const data = Object.values(req.body);
  const keys = Object.keys(req.body);

  if (req.body.id) {
    return res.status(400).json({ message: "You can't update your id" });
  }

  const query: string = format(
    `
    UPDATE
         movies_table
    SET(%I) = ROW(%L)
    WHERE
        id = $1
    RETURNING *;
    `,
    keys,
    data
  );

  const queryConfig: QueryConfig = {
    text: query,
    values: [id],
  };

  const queryResult: movieQueryResult = await client.query(queryConfig);

  if (!queryResult.rowCount) {
    return res.status(404).json({ message: "Movie not found!" });
  }

  return res.json(queryResult.rows[0]);
};

const deleteMovie = async (req: Request, res: Response): Promise<Response> => {
  const id: number = +req.params.id;
  console.log(id);

  const query: string = `
    DELETE FROM
         movies_table
    WHERE
        id = $1;
    `;

  const queryConfig: QueryConfig = {
    text: query,
    values: [id],
  };

  const queryResult: movieQueryResult = await client.query(queryConfig);

  if (!queryResult.rowCount) {
    return res.status(404).json({ message: "Movie not found!" });
  }

  return res.status(204).send();
};

export {
  createMovies,
  listMovies,
  createMoviesFormat,
  deleteMovie,
  updateMovie,
};
