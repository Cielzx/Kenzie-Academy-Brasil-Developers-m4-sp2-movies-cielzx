import { QueryResult } from "pg";

interface iMoviesRequest {
  name: string;
  description: string;
  duration: number;
  price: number;
}

interface iPagination {
  prevPage: string | null;
  nextPage: string | null;
  count: number;
  data: iMoviesRequest[];
}

interface RequestQuery {
  page: number;
  perPage: number;
  id: number;
}

interface idMovies extends iMoviesRequest {
  id: number;
}

type movieQueryResult = QueryResult<idMovies>;
export {
  iMoviesRequest,
  idMovies,
  movieQueryResult,
  iPagination,
  RequestQuery,
};
