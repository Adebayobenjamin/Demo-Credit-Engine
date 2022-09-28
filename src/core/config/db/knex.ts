import knex from "knex";
import dbconfig from "../knexfile";
const enviroment = process.env.NODE_ENV || "development";
const db = knex(dbconfig[enviroment]);

export const syncronize = async () => {

  // db.migrate.make("create_tables", {
  //   directory: __dirname + "/migrations",
  //   extension: "ts",
  // });
  db.migrate.up({
    directory: __dirname + "/migrations",
    extension: "ts",
  });
  // up(db);
  return db;
};

export default db;
