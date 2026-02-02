import "dotenv/config";                 // 🔥 THIS LINE IS CRITICAL
import connectDB from "../db/index.js";
import { buildExploreFeed, buildExplorePostsFeed } from "../workers/exploreFeed.worker.js";

await connectDB();
await buildExploreFeed();
await buildExplorePostsFeed();

process.exit(0);
