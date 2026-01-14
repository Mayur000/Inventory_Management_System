import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import assetTypeRoutes from "./src/routes/assetTypeRoutes.js";
import IndividualAssetRoutes from "./src/routes/individualAssetRoutes.js";
import issueRoutes from "./src/routes/issueRoutes.js";
import cors from "cors";
import authRouter from "./src/routes/authRoutes.js"
import cookieParser from "cookie-parser";
import locationRoutes from "./src/routes/locationRoutes.js";
import movementRoutes from "./src/routes/movementRoutes.js"
import userRoutes from "./src/routes/usersRoute.js"


dotenv.config({
    path:"./.env"
});
const app=express();

const PORT=process.env.PORT;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(","),
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(cookieParser());


//Routes
app.use("/api/asset-types", assetTypeRoutes);
app.use("/api/individual-assets", IndividualAssetRoutes);
app.use("/api/issues", issueRoutes);

// auth
app.use("/api/auth", authRouter);

//user
app.use("/api/users", userRoutes);


//location
app.use("/api/locations", locationRoutes);

//user
app.use("/api/users", userRoutes);

//movement
app.use("/api/movements", movementRoutes);


app.listen(PORT, ()=>{
    console.log("App is listening on port : ", PORT);
});