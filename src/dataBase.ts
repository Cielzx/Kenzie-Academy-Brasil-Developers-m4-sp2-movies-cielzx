import { Client } from "pg";

const client: Client = new Client({
  user: "postgres",
  password: "1234",
  host: "localhost",
  database: "movie_data",
  port: 5432,
});

const startDat = async (): Promise<void> => {
  await client.connect();
  console.log("Database connected!");
};

export { startDat, client };
