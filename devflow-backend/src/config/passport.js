import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback", 
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // The `profile` contains Google account info.
        // Normally you'd find or create a user here in DB.
        // But since you're using Google only, we simply return the profile.
        return done(null, profile);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Required for sessions, but we're not using sessions.
// Passport still needs these to avoid errors.
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;
