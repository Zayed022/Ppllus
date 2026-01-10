import User from "../models/users.models.js";
import bcrypt from "bcryptjs";
import { hashToken } from "../utils/token.js";


const generateAccessAndRefreshTokens = async (user) => {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
  
    user.refreshTokenHash = hashToken(refreshToken);
    await user.save({ validateBeforeSave: false });
  
    return { accessToken, refreshToken };
};
  
export const register = async (req, res) => {
    const { email, phone, password } = req.body;
  
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
  
    res.status(201).json({
      user: {
        id: user._id,
        isOnboarded: user.isOnboarded,
      },
      ...tokens,
    });
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
    const user = await User.findById(req.user.sub).select(
      "-password -refreshTokenHash"
    );
    res.json(user);
};  

export const updateBasicProfile = async (req, res) => {
    const { username } = req.body;
  
    if (username) {
      const exists = await User.findOne({ username });
      if (exists && exists._id.toString() !== req.user.sub) {
        return res.status(409).json({ message: "Username already taken" });
      }
    }
  
    const user = await User.findByIdAndUpdate(
      req.user.sub,
      req.body,
      { new: true }
    );
  
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
    const { profileImage } = req.body; // Cloudinary URL
  
    const user = await User.findByIdAndUpdate(
      req.user.sub,
      { profileImage },
      { new: true }
    );
  
    res.json(user);
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
    const q = req.query.q?.trim();
    if (!q || q.length < 2) return res.json([]);
  
    const users = await User.find({
      username: new RegExp(`^${q}`, "i"),
      status: "ACTIVE",
    })
      .limit(20)
      .select("username profileImage");
  
    res.json(users);
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