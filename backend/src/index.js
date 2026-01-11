import dotenv from "dotenv"
dotenv.config({
    path: './.env'
})
import connectDB from "./db/index.js"
import { app } from "./app.js"
import { pgPool } from "./db/postgres.js"

await pgPool.query("SELECT 1");
connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port: ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log("MongoDB Connection failed !!", err)
})