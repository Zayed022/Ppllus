import "dotenv/config";                 // 🔥 THIS LINE IS CRITICAL
import connectDB from "../db/index.js";
import { buildExploreFeed, buildExplorePostsFeed, buildGlobalReelFeed } from "../workers/exploreFeed.worker.js";

await connectDB();
await buildExploreFeed();
await buildExplorePostsFeed();
await buildGlobalReelFeed();


process.exit(0);
