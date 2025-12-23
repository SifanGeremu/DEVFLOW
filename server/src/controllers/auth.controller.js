import jwt from "jsonwebtoken";
import {
  buildGoogleAuthUrl,
  exchangeCodeForTokens,
  verifyIdToken,
  findOrCreateUser,
} from "../services/auth.service.js";

/**
 * STEP 1: Redirect user to Google
 */
async function redirectToGoogle(req, res) {
  try {
    const url = await buildGoogleAuthUrl();
    return res.redirect(url);
  } catch (err) {
    console.error("[AuthController] redirectToGoogle:", err);
    return res.status(500).json({ error: "Failed to redirect to Google" });
  }
}

/**
 * STEP 2: Google redirects back here
 * We:
 *  - exchange code
 *  - verify Google identity
 *  - create/find user
 *  - issue OUR OWN JWT
 *  - redirect to frontend with OUR token
 */
// async function handleGoogleCallback(req, res) {
//   const code = req.query.code;

//   if (!code) {
//     return res.redirect("http://localhost:8080/login?error=missing_code");
//   }

//   try {
//     // 1️⃣ Exchange auth code for Google tokens
//     const tokens = await exchangeCodeForTokens(code);
//     if (!tokens?.id_token) {
//       throw new Error("No id_token returned from Google");
//     }

//     // 2️⃣ Verify Google ID token
//     const googleUser = await verifyIdToken(tokens.id_token);

//     // 3️⃣ Find or create user in DB
//     const user = await findOrCreateUser(googleUser);

//     // 4️⃣ ISSUE YOUR OWN JWT (THIS IS THE FIX)
//     const appToken = jwt.sign(
//       {
//         id: user.id,
//         email: user.email,
//       },
//       process.env.JWT_ACCESS_SECRET,
//       {
//         expiresIn: "7d",
//       }
//     );

//     // 5️⃣ Redirect to frontend callback
//     const FRONTEND_URL = "http://localhost:8080";

//     return res.redirect(`${FRONTEND_URL}/auth/callback?token=${appToken}`);
//   } catch (err) {
//     console.error("[AuthController] handleGoogleCallback:", err);
//     return res.redirect("http://localhost:8080/login?error=auth_failed");
//   }
// }


async function handleGoogleCallback(req, res) {
  const code = req.query.code;
  if (!code) return res.status(400).json({ error: "Missing auth code" });

  try {
    const tokens = await exchangeCodeForTokens(code);
    if (!tokens?.id_token) throw new Error("Empty id_token from Google");

    // Verify ID token
    const googleUser = await verifyIdToken(tokens.id_token);

    // Find or create user in your DB
    const user = await findOrCreateUser(googleUser);

    // Generate server JWT
    const serverToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "1h" }
    );

    const FRONTEND_URL = "http://localhost:8080";
    return res.redirect(
      `${FRONTEND_URL}/auth/callback?token=${serverToken}`
    );
  } catch (err) {
    console.error("[AuthController] handleGoogleCallback error:", err.message || err);
    return res.redirect(`http://localhost:8080/login?error=auth_failed`);
  }
}




export default {
  redirectToGoogle,
  handleGoogleCallback,
};
