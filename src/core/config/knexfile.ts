import { config } from "dotenv";
config();
export default {
  development: {
    client: "mysql2",
    connection: {
      host: "localhost",
      user: "democredit",
      password: "rtyyxksl",
      database: "democredit",
    },
    pool: { min: 0, max: 7 },
    migrations: {
      directory: __dirname + "/db/migrations",
      extension: "ts",
    },
    seeds: {
      directory: __dirname + "/db/seeds",
    },
  },
  production: {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: __dirname + "/db/migrations",
    },
    seeds: {
      directory: __dirname + "/db/seeds",
    },
  },
};
