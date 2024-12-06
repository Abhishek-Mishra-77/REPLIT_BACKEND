import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Database from "./utils/database.js";
const app = express();

import authRoutes from "./routes/authRoutes.js";

/* -------------------------------------------------------------------------- */
/*                           SERVER CONFIGURATION                             */
/* -------------------------------------------------------------------------- */

dotenv.config();
app.use(express.json());
app.use(cors());

/* -------------------------------------------------------------------------- */
/*                           ROUTES ORIGIN                                    */
/* -------------------------------------------------------------------------- */

app.use("/auth", authRoutes)


/* -------------------------------------------------------------------------- */
/*                           SERVER AND DATABASE SETUP                        */
/* -------------------------------------------------------------------------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    await Database();
    console.log(`Server is running on PORT ${PORT} and database connected.`);
})


