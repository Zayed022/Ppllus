import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      sparse: true,
      index: true,
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    role: {
      type: String,
      enum: ["USER", "VENDOR", "ADMIN"],
      default: "USER",
    },

    status: {
      type: String,
      enum: ["ACTIVE", "BLOCKED", "DELETED"],
      default: "ACTIVE",
    },

    pplusNumber: {
      type: String,
      unique: true,
      index: true,
    },

    password: {
      type: String,
      select: false,
    },

    authProviders: {
      google: {
        id: { type: String, index: true },
        email: { type: String },
      },
      apple: {
        id: { type: String, index: true },
        email: { type: String },
      },
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    passwordReset: {
      tokenHash: { type: String },
      expiresAt: { type: Date },
    },

    refreshTokenHash: {
        type: String,
        select: false,
      },
      

      username: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
      },
      
      usernameLower: {
        type: String,
        index: true,
      },
      

    firstName: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    surname: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    bio: {
      type: String,
      maxlength: 150,
    },

    dob: {
      type: Date,
    },

    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER", "NOT_SPECIFIED"],
      default: "NOT_SPECIFIED",
    },

    visibility: {
      type: String,
      enum: ["PUBLIC", "PRIVATE"],
      default: "PUBLIC",
    },

    interests: [{ type: String, trim: true }],

    profileImage: {
      type: String,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        
      },
      coordinates: {
        type: [Number],
        default: undefined // IMPORTANT
      }
    },

    city: {
      type: String,
      trim: true,
      index: true,
    },

    isOnboarded: {
      type: Boolean,
      default: false,
    },

    mutedStories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true,
      },
    ],

    closeFriends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true,
      },
    ],

    lastLoginAt: {
      type: Date,
    },
    pushTokens: [
      {
        type: String,
      },
    ],
    
  },
  { timestamps: true }
);


userSchema.index({ location: "2dsphere" });
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });


userSchema.virtual("name").get(function () {
  return [this.firstName, this.surname].filter(Boolean).join(" ");
});

userSchema.pre("save", function (next) {
  if (this.isModified("username") && this.username) {
    this.usernameLower = this.username.toLowerCase();
  }
  
});


userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;

  this.password = await bcrypt.hash(this.password, 10);
});



userSchema.methods.isPasswordCorrect = async function (password) {
  if (!this.password) return false;
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      sub: this._id,
      email: this.email,
      username: this.username,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      audience: "ppllus-app",
      issuer: "ppllus-auth",
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { sub: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
      audience: "ppllus-app",
      issuer: "ppllus-auth",
    }
  );
};


export default mongoose.model("User", userSchema);
