import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Database from "./utils/database.js";
const app = express();

/* -------------------------------------------------------------------------- */
/*                           SERVER CONFIGURATION                             */
/* -------------------------------------------------------------------------- */

dotenv.config();
app.use(express.json());
app.use(cors());

/* -------------------------------------------------------------------------- */
/*                           ROUTES ORIGIN                                    */
/* -------------------------------------------------------------------------- */

const PORT = process.env.PORT || 5000;


/* -------------------------------------------------------------------------- */
/*                           SERVER AND DATABASE SETUP                        */
/* -------------------------------------------------------------------------- */

app.listen(PORT, async () => {
    await Database();
    console.log(`Server is running on PORT ${PORT} and database connected.`);
})


