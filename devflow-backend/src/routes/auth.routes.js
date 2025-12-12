import dotenv from "dotenv";
dotenv.config();
import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
const router = express.Router();
import verifyJWT from "../middleware/auth.js";


// Step 1: redirect user to Google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Step 2: handle Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    const profile = req.user;

    const payload = {
      id: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
    };

    const token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "1hr",
    });

    // Send token in JSON instead of redirect
    res.json({
      message: "Google login successful",
      token,
      user: payload,
    });
  }
);
// Protected route example
router.get('/protected', verifyJWT, (req, res) => {
  res.json({
    message: 'You accessed a protected route!',
    userId: req.userId,
    user: req.user
  });
});


export default router;
