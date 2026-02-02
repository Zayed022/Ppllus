import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { rateLimiter } from "./middlewares/rateLimiter.js"
import { buildExploreFeed } from "./workers/exploreFeed.worker.js"

const app = express()
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({limit: "16kb"}))
app.use(cookieParser())


// app.js

app.use(rateLimiter({
  keyPrefix: "global",
  limit: 1000,
  windowSec: 60,
}));



app.use("/wallet", rateLimiter({ keyPrefix: "wallet", limit: 5, windowSec: 60 }));
app.use("/engagement", rateLimiter({ keyPrefix: "engagement", limit: 100, windowSec: 60 }));



import userRoute from './routes/users.routes.js'
app.use("/api/v1/users",userRoute);

import followRoute from './routes/follow.routes.js'
app.use("/api/v1/follow",followRoute);

import reelRoute from './routes/reel.routes.js'
app.use("/api/v1/reel",reelRoute);

import exploreRoute from './routes/explore.routes.js'
app.use("/api/v1/explore",exploreRoute);

import discoveryRoute from './routes/discovery.routes.js'
app.use("/api/v1/discovery",discoveryRoute);

import safetyRoute from './routes/safety.routes.js'
app.use("/api/v1/safety",safetyRoute);

import adminRoute from './routes/admin.routes.js'
app.use("/api/v1/admin",adminRoute);

import healthRoute from './routes/health.routes.js'
app.use("/api/v1/health",healthRoute);

import storyRoute from './routes/story.routes.js'
app.use("/api/v1/story",storyRoute);

import feedRoute from './routes/feed.routes.js'
app.use("/api/v1/feed",feedRoute);

import postRoute from './routes/post.routes.js'
app.use("/api/v1/post",postRoute);

import commentRoute from './routes/comment.routes.js'
app.use("/api/v1/comment",commentRoute);

import notificationRoute from './routes/notification.routes.js'
app.use("/api/v1/notification",notificationRoute);

import messageRoute from './routes/message.routes.js'
app.use("/api/v1/message",messageRoute);


export {app}