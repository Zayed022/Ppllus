import { Router } from "express";
import { createShop, 
    deactivateShop, 
    getMyShops, 
    getNearbyShops, 
    getShopById, 
    updateShop, 
    updateShopStatus } from "../controllers/shop.controllers.js";
import { authenticate } from "../middlewares/auth.middlewares.js";


const router = Router();

router.post("/", authenticate, createShop);                             // done
router.put("/:shopId", authenticate, updateShop);
router.get("/nearby", authenticate, getNearbyShops);
router.get("/me", authenticate, getMyShops);
router.get("/:shopId", getShopById);
router.patch("/:shopId/status", authenticate, updateShopStatus);
router.patch("/:shopId/deactivate", authenticate, deactivateShop);


export default router;
