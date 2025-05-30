import User from "../models/User.js";
import fs from "fs";
import uploadImage from "../utils/cloudinaryHelper.js";
import { generateCookie, clearCookie } from "../utils/cookieHelper.js";

// Helper function to set auth cookie and send response
const sendTokenResponse = (user, statusCode, res, message) => {
  const { token, cookieOptions } = generateCookie(user._id);

  res
    .status(statusCode)
    .cookie("token", token, cookieOptions)
    .json({
      success: true,
      message,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          bio: user.bio,
        },
        token,
      },
    });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, bio } = req.body;
    const avatar = req.file ? req.file.path : null;
    if (!avatar) {
      return res.status(400).json({
        success: false,
        message: "Please upload an avatar image",
      });
    }

    if (!name || !email || !password) {
      fs.unlinkSync(avatar);
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password",
      });
    }

    if (password.length < 6) {
      fs.unlinkSync(avatar);
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      fs.unlinkSync(avatar);
      return res.status(403).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const avatarUrl = await uploadImage(avatar);
    if (!avatarUrl) {
      return res.status(500).json({
        success: false,
        message: "Server error during avatar upload",
      });
    }

    const user = new User({ name, email, password, avatar: avatarUrl, bio });
    await user.save();

    sendTokenResponse(user, 201, res, "User registered successfully");
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    sendTokenResponse(user, 200, res, "Login successful");
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, bio } = req.body;

    if (!name && bio) {
      return res.status(400).json({
        success: false,
        message: "Please provide either name or bio to update",
      });
    }

    const updateData = {};

    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          bio: user.bio,
        },
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during profile update",
    });
  }
};

export const logout = async (req, res) => {
  try {
    const cookieOptions = clearCookie();

    res.status(200).cookie("token", "", cookieOptions).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during logout",
    });
  }
};
