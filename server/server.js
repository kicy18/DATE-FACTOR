import express from "express";
import cors from "cors";
import "dotenv/config";

import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRoutes.js";
import restaurantRouter from "./routes/restaurantRoutes.js";

const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.get("/", (req, res) => res.send("API Working"));
app.use("/api/user", userRouter);
app.use("/api/restaurants", restaurantRouter);

connectDB()
    .then(() => {
        app.listen(PORT, () =>
            console.log("Server is running on the " + PORT)
        );
    })
    .catch((error) => {
        console.error("Failed to connect to database:", error.message);
        process.exit(1);
    });