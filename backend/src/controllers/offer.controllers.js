import { redeemOffer } from "../services/wallet.spend.service.js";

import { emitEvent } from "../events/emitEvent.js";

export const redeemOfferController = async (req, res) => {
  const { offerId, shopId, pointsRequired } = req.body;

  const result = await redeemOffer({
    userId: req.user.sub,
    offerId,
    shopId,
    pointsRequired,
  });

  // 🔔 USER NOTIFICATION
  emitEvent({
    type: "OFFER_REDEEM",
    actorId: req.user.sub,
    targetUserId: req.user.sub,
    entityId: offerId,
  });

  res.json({
    message: "Offer redeemed successfully",
    balance: result.balance,
  });
};

