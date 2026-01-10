import express from "express";
import { authenticate } from "../middlewares/auth.middlewares.js";
import {
  getWalletBalance,
  getWalletLedger,
} from "../controllers/wallet.controllers.js";
import { rateLimiter } from "../middlewares/rateLimiter.js";
import { redeemOfferController } from "../controllers/offer.controllers.js";

const router = express.Router();

const walletLimiter = rateLimiter({
  keyPrefix: "wallet",
  limit: 5,
  windowSec: 60,
});

router.get("/balance", authenticate, getWalletBalance);
router.get("/ledger", authenticate, getWalletLedger);
router.post(
  "/redeem",
  authenticate,
  walletLimiter,
  redeemOfferController,
);

export default router;
