import dotenv from "dotenv";

// ✅ LOAD ENV FIRST
dotenv.config({ path: "./.env", override: true });

import { pgPool } from "./postgres.js";

(async () => {
  console.log("PG_PASSWORD type:", typeof process.env.PG_PASSWORD);
  console.log("PG_PASSWORD value:", process.env.PG_PASSWORD);

  const res = await pgPool.query("SELECT NOW()");
  console.log(res.rows[0]);

  process.exit(0);
})();
