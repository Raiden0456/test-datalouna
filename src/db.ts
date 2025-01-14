import postgres from "postgres";
import { config } from "./config";

console.log(config);
const sql = postgres({
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
  username: config.db.user,
  password: config.db.password,
});

export default sql;
