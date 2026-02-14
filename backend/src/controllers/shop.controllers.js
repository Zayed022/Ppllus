import Shop from "../models/shop.models.js"

export const createShop = async (req, res) => {
  try {
    const { name, category, description, address, lng, lat } = req.body;

    if (!name || !category || !lng || !lat) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const shop = await Shop.create({
      owner: req.user.sub,
      name,
      category,
      description,
      address,
      location: {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)],
      },
    });

    res.status(201).json(shop);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateShop = async (req, res) => {
    try {
      const { shopId } = req.params;
  
      const shop = await Shop.findById(shopId);
      if (!shop) return res.status(404).json({ message: "Shop not found" });
  
      if (shop.owner.toString() !== req.user.sub) {
        return res.status(403).json({ message: "Unauthorized" });
      }
  
      Object.assign(shop, req.body);
  
      if (req.body.lng && req.body.lat) {
        shop.location.coordinates = [
          parseFloat(req.body.lng),
          parseFloat(req.body.lat),
        ];
      }
  
      await shop.save();
  
      res.json(shop);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};

export const getShopById = async (req, res) => {
    try {
      const { shopId } = req.params;
  
      const shop = await Shop.findOne({
        _id: shopId,
        status: "APPROVED",
        isActive: true,
      }).populate("owner", "username profilePicture");
  
      if (!shop) return res.status(404).json({ message: "Shop not found" });
  
      res.json(shop);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};

export const getMyShops = async (req, res) => {
    try {
      const shops = await Shop.find({ owner: req.user.sub }).sort({
        createdAt: -1,
      });
  
      res.json(shops);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};

export const updateShopStatus = async (req, res) => {
    try {
      const { shopId } = req.params;
      const { status } = req.body;
  
      if (!["APPROVED", "REJECTED", "SUSPENDED"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
  
      const shop = await Shop.findByIdAndUpdate(
        shopId,
        { status },
        { new: true }
      );
  
      if (!shop) return res.status(404).json({ message: "Shop not found" });
  
      res.json(shop);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};

export const getNearbyShops = async (req, res) => {
    try {
      const { lng, lat, radius = 5000, category, page = 1, limit = 20 } = req.query;
  
      if (!lng || !lat) {
        return res.status(400).json({ message: "Coordinates required" });
      }
  
      const skip = (page - 1) * limit;
  
      const shops = await Shop.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [parseFloat(lng), parseFloat(lat)],
            },
            distanceField: "distance",
            maxDistance: parseInt(radius),
            spherical: true,
          },
        },
        {
          $match: {
            status: "APPROVED",
            isActive: true,
            ...(category && { category }),
          },
        },
        { $sort: { distance: 1 } },
        { $skip: skip },
        { $limit: parseInt(limit) },
      ]);
  
      res.json(shops);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};

export const deactivateShop = async (req, res) => {
    try {
      const { shopId } = req.params;
  
      const shop = await Shop.findById(shopId);
      if (!shop) return res.status(404).json({ message: "Shop not found" });
  
      if (shop.owner.toString() !== req.user.sub) {
        return res.status(403).json({ message: "Unauthorized" });
      }
  
      shop.isActive = false;
      await shop.save();
  
      res.json({ message: "Shop deactivated" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};

export const getApprovedShops = async (req, res) => {
    try {
      const { category, page = 1, limit = 20 } = req.query;
  
      const filter = {
        status: "APPROVED",
        isActive: true,
        ...(category && { category }),
      };
  
      const shops = await Shop.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
  
      res.json(shops);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};


  
  
  
  
  
  
  