import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Database from "./utils/database.js";
const app = express();



import authRoutes from "./routes/authRoutes.js";
import folderRoutes from "./routes/folderRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import langaugeRoutes from "./routes/LangaugeRoutes.js";
import compilerRoutes from "./routes/compilerRoutes.js";

import createInitialUser from "./services/createInitialUser.js";

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
app.use("/folders", folderRoutes)
app.use('/files', fileRoutes)
app.use('/langauges', langaugeRoutes)
app.use('/compiler', compilerRoutes)


/* -------------------------------------------------------------------------- */
/*                           SERVER AND DATABASE SETUP                        */
/* -------------------------------------------------------------------------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    await Database();
    await createInitialUser();
    console.log(`Server is running on PORT ${PORT} and database connected.`);
})


