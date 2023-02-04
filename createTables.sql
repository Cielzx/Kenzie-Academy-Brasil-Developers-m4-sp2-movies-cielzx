CREATE DATABASE  movies_data;

CREATE TABLE IF NOT EXISTS movies_table(
id BIGSERIAL PRIMARY KEY,
name VARCHAR(50) NOT NULL UNIQUE,
description VARCHAR,
duration INTEGER NOT NULL,
price INTEGER NOT NULL,
);

INSERT INTO
    movies_table(name, description,price,duration)
VALUES
     ("Vingadores", "Bom filme para assistir com a familia",90,120)
RETURNING *

