import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

/* -------------------------------------------------------------------------- */
/*                           DATABASE CONNECTION                              */
/* -------------------------------------------------------------------------- */

const Database = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default Database;