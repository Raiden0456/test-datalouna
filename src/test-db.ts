import sql from "./db";

async function testConnection() {
  try {
    const result = await sql`SELECT 1 AS test`;
    console.log("Database connection successful:", result);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  } finally {
    await sql.end();
  }
}

testConnection();
