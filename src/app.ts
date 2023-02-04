import express, { Application } from "express";
import { startDat } from "./dataBase";
import {
  createMovies,
  createMoviesFormat,
  deleteMovie,
  listMovies,
  updateMovie,
} from "./function";
import { paginateFunction, verifyMovies, verifyName } from "./middleware";

const app: Application = express();
app.use(express.json());

app.post("/movie_data", verifyName, createMoviesFormat);
app.get("/movie_data", paginateFunction, listMovies);
app.patch("/movie_data/:id", verifyMovies, verifyName, updateMovie);
app.delete("/movie_data/:id", verifyMovies, deleteMovie);

app.listen(3000, async () => {
  await startDat();
  console.log("Server started on port 3000");
});
