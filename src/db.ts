import postgres from "postgres";
import { config } from "./config";

console.log(`👀 Connecting to database with the following parameters:
  Host: ${config.db.host}
  Port: ${config.db.port}
  Database: ${config.db.database}
  User: ${config.db.user}
`);

const sql = postgres({
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
  username: config.db.user,
  password: config.db.password,
});

sql`SELECT 1`
  .then(() => {
    console.log(`🗃️  Database connected successfully`);
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

export default sql;
