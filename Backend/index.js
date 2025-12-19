import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import assetTypeRoutes from "./src/routes/assetTypeRoutes.js";
import IndividualAssetRoutes from "./src/routes/individualAssetRoutes.js";
import issueRoutes from "./src/routes/issueRoutes.js";

dotenv.config();
const app=express();

const PORT=process.env.PORT;

connectDB();

app.use(express.json());


//Routes
app.use("/api/asset-types", assetTypeRoutes);
app.use("/api/individual-assets", IndividualAssetRoutes);
app.use("/api/issues", issueRoutes);


app.listen(PORT, ()=>{
    console.log("App is listening on port : ", PORT);
});