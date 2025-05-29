import { generateToken } from "./jwt.js";

export const generateCookie = (userId) => {
  const token = generateToken(userId);

  const cookieOptions = {
    expires: new Date(
      Date.now() + (process.env.COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000 // Default to 7 days
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  return { token, cookieOptions };
};

export const clearCookie = () => {
  return {
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };
};
