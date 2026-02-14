import User from "../models/users.models.js";
import bcrypt from "bcryptjs";
import Follow from "../models/follow.models.js"
import Post from "../models/post.models.js"
import Reel from "../models/reel.models.js"
import { hashToken } from "../utils/token.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { getRedis } from "../db/redis.js";
import mongoose from "mongoose";
import { getWalletBalanceByUserId } from "../services/wallet.service.js";
const redis = getRedis();

const generateAccessAndRefreshTokens = async (user) => {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
  
    user.refreshTokenHash = hashToken(refreshToken);
    await user.save({ validateBeforeSave: false });
  
    return { accessToken, refreshToken };
};
  
export const register = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    console.log("REGISTER REQUEST", { email, phone });

    const exists = await User.findOne({ $or: [{ email }, { phone }] });
    if (exists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const user = await User.create({
      email,
      phone,
      password,
      pplusNumber: `PL-${Date.now()}`,
    });

    const tokens = await generateAccessAndRefreshTokens(user);

    return res.status(201).json({
      user: {
        id: user._id,
        isOnboarded: user.isOnboarded,
      },
      ...tokens,
    });
  } catch (error) {
    console.error("REGISTER ERROR", error);

    return res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
};


export const login = async (req, res) => {
    const { email, password } = req.body;
  
    const user = await User.findOne({ email }).select("+password +refreshTokenHash");
    if (!user || !(await user.isPasswordCorrect(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  
    const tokens = await generateAccessAndRefreshTokens(user);
  
    user.lastLoginAt = new Date();
    await user.save({ validateBeforeSave: false });
  
    res.json({
      user: {
        id: user._id,
        isOnboarded: user.isOnboarded,
      },
      ...tokens,
    });
};

export const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }
  
    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
  
    const user = await User.findById(payload.sub).select("+refreshTokenHash");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
  
    if (hashToken(refreshToken) !== user.refreshTokenHash) {
      return res.status(401).json({ message: "Token reuse detected" });
    }
  
    const tokens = await generateAccessAndRefreshTokens(user);
    res.json(tokens);
};  

export const logout = async (req, res) => {
    await User.findByIdAndUpdate(req.user.sub, {
      refreshTokenHash: null,
    });
  
    res.json({ message: "Logged out" });
};

export const getMe = async (req, res) => {
  const userId = req.user.sub;

  const user = await User.findById(userId)
    .select("-password -refreshTokenHash")
    .lean();

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // 🔥 Fetch wallet balance (Redis → PG fallback)
  const balance = await getWalletBalanceByUserId(userId);

  res.json({
    ...user,
    wallet: {
      balance,
    },
  });
};
  


export const updateBasicProfile = async (req, res) => {
  const { username, firstName, surname, bio, website } = req.body;

  if (username) {
    const exists = await User.findOne({ username });
    if (exists && exists._id.toString() !== req.user.sub) {
      return res.status(409).json({ message: "Username already taken" });
    }
  }

  const user = await User.findByIdAndUpdate(
    req.user.sub,
    { username, firstName, surname, bio, website },
    { new: true }
  ).select("username firstName surname bio website profileImage");

  res.json(user);
};
 

export const updateDobGender = async (req, res) => {
    const { dob, gender } = req.body;
  
    const user = await User.findByIdAndUpdate(
      req.user.sub,
      { dob, gender },
      { new: true }
    );
  
    res.json(user);
};

export const updateInterests = async (req, res) => {
    const { interests } = req.body;
  
    const user = await User.findByIdAndUpdate(
      req.user.sub,
      { interests },
      { new: true }
    );
  
    res.json(user);
};

export const updateProfileImage = async (req, res) => {
  const imageLocalPath = req.files?.profileImage[0]?.path;
  console.log(imageLocalPath);
  if (!imageLocalPath) {
    return res.status(400).json({ message: "Image file is required" });
  }
  const image = await uploadOnCloudinary(imageLocalPath);
  if (!image) {
    return res.status(400).json({ message: "Image file is required" });
  } // Cloudinary URL
  
    const user = await User.findByIdAndUpdate(
      req.user.sub,
      { profileImage: image.url },
      { new: true }
    );
  
    res.json(user);
};


export const getMyProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.user.sub).select(
      "username profileImage"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      userId: user._id,
      username: user.username,
      profileImage: user.profileImage || null,
    });
  } catch (err) {
    console.error("Get profile image error:", err);
    res.status(500).json({ message: "Failed to fetch profile image" });
  }
};


export const completeOnboarding = async (req, res) => {
    const user = await User.findByIdAndUpdate(
      req.user.sub,
      { isOnboarded: true },
      { new: true }
    );
  
    res.json({ message: "Onboarding completed", user });
};

export const searchUsers = async (req, res) => {
  const q = req.query.q?.trim().toLowerCase();
  const userId = req.user.sub;

  if (!q || q.length < 2) {
    return res.json([]);
  }

  const cacheKey = `search:users:${q}`;

  // 1️⃣ Redis cache
  const cached = await redis.get(cacheKey);
  if (cached) {
    return res.json(JSON.parse(cached));
  }

  // 2️⃣ Prefix search (index-backed)
  const users = await User.find({
    usernameLower: {
      $gte: q,
      $lt: q + "\uffff",
    },
    status: "ACTIVE",
  })
    .select("_id username profileImage lastLoginAt")
    .limit(30)
    .lean();

  // 3️⃣ Mutual followers ranking (Instagram secret sauce)
  const following = await Follow.find({
    follower: userId,
    status: "ACTIVE",
  }).select("following");

  const followingSet = new Set(
    following.map((f) => f.following.toString())
  );

  // 4️⃣ Rank results
  const ranked = users
    .map((u) => {
      let score = 0;

      if (u.username === q) score += 100;          // exact
      else if (u.username.startsWith(q)) score += 50;

      if (followingSet.has(u._id.toString())) score += 30;

      if (u.lastLoginAt) {
        const hoursAgo =
          (Date.now() - new Date(u.lastLoginAt)) / 36e5;
        score += Math.max(0, 10 - hoursAgo);
      }

      return { ...u, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)
    .map(({ score, ...u }) => u);

  // 5️⃣ Cache
  await redis.set(cacheKey, JSON.stringify(ranked), "EX", 60);

  res.json(ranked);
};

export const updatePrivacy = async (req, res) => {
    const { visibility } = req.body;
  
    const user = await User.findByIdAndUpdate(
      req.user.sub,
      { visibility },
      { new: true }
    );
  
    res.json(user);
};

export const deactivateAccount = async (req, res) => {
    await User.findByIdAndUpdate(req.user.sub, {
      status: "DELETED",
    });
  
    res.json({ message: "Account deactivated" });
};

export const getSuggestedUsers = async (req, res) => {
  const suggestions = await User.find({
    _id: { $ne: req.user.sub },
    visibility: "PUBLIC",
  })
    .sort({ createdAt: -1 })
    .limit(10)
    .select("username profileImage");

  res.json(suggestions);
};

// controllers/user.controller.ts
export const getUserProfile = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId)
    .select("_id username profileImage bio")
    .lean();

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
};

export const getUserProfileById = async (req, res) => {
  try {
    const { userId } = req.params;
    const viewerId = req.user?.sub;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    // 1️⃣ Fetch user
    const user = await User.findOne({
      _id: userId,
      status: "ACTIVE",
    })
      .select(
        "_id username firstName surname bio profileImage city visibility lastLoginAt"
      )
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isSelf =
      viewerId && viewerId.toString() === user._id.toString();

    // 2️⃣ Parallel counts + follow state (FAST)
    const [
      postsCount,
      reelsCount,
      followersCount,
      followingCount,
      followRelation,
    ] = await Promise.all([
      Post.countDocuments({
        author: user._id,
        isDeleted: false,
      }),
      Reel.countDocuments({
        creator: user._id,
        isDeleted: false,
        "moderation.status": "ACTIVE",
      }),
      Follow.countDocuments({
        following: user._id,
        status: "ACTIVE",
      }),
      Follow.countDocuments({
        follower: user._id,
        status: "ACTIVE",
      }),
      viewerId
        ? Follow.findOne({
            follower: viewerId,
            following: user._id,
          }).select("status")
        : null,
    ]);

    const isFollowing = followRelation?.status === "ACTIVE";
    const isRequested = followRelation?.status === "PENDING";

    // 3️⃣ PRIVATE profile gate (Instagram-style)
    if (
      user.visibility === "PRIVATE" &&
      !isSelf &&
      !isFollowing
    ) {
      return res.json({
        user: {
          _id: user._id,
          username: user.username,
          profileImage: user.profileImage || null,
          isPrivate: true,
        },
        counts: {
          followers: followersCount,
          following: followingCount,
        },
        isFollowing: false,
        isRequested,
        isSelf,
      });
    }

    // 4️⃣ Full profile response
    res.json({
      user: {
        _id: user._id,
        username: user.username,
        name: [user.firstName, user.surname]
          .filter(Boolean)
          .join(" "),
        bio: user.bio || "",
        profileImage: user.profileImage || null,
        city: user.city || null,
        visibility: user.visibility,
        lastLoginAt: user.lastLoginAt,
      },
      counts: {
        posts: postsCount,
        reels: reelsCount,
        followers: followersCount,
        following: followingCount,
      },
      isFollowing,
      isRequested,
      isSelf,
    });
  } catch (err) {
    console.error("Get user profile by ID error:", err);
    res.status(500).json({ message: "Failed to load profile" });
  }
};

