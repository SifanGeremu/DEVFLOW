import dotenv from "dotenv";
dotenv.config();
import pool from "./src/config/db.js";
import express from "express";
import passport from "./src/config/passport.js";
import session from "express-session";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 4000;

// middleware to parse json bodies
app.use(express.json());
app.use(cookieParser());


app.use(
  session({
    secret: "temporary",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.listen(PORT, () => {
  console.log("LISTENING ON `${PORT}`");
});
import authRoutes from "./src/routes/auth.routes.js";
app.use("/auth", authRoutes);

// sample route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;
