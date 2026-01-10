import pkg from "pg";
const { Pool } = pkg;

export const pgPool = new Pool({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "zayed123", // hardcoded
    database: "pplus_wallet",
  });
  

pgPool.on("connect", () => {
  console.log("PostgreSQL wallet DB connected");
});

pgPool.on("error", (err) => {
  console.error("PostgreSQL error", err);
  process.exit(1);
});
