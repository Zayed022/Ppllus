import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { rateLimiter } from "./middlewares/rateLimiter.js"
const app = express()
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({limit: "16kb"}))
app.use(cookieParser())
app.use(
    rateLimiter({
      keyPrefix: "global",
      limit: 300,
      windowSec: 60,
    })
  );
  

import userRoute from './routes/users.routes.js'
app.use("/api/v1/users",userRoute);

import followRoute from './routes/follow.routes.js'
app.use("/api/v1/follow",followRoute);

import reelRoute from './routes/reel.routes.js'
app.use("/api/v1/reel",reelRoute);


export {app}