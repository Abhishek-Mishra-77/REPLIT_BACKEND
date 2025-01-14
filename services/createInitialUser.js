import User from "./../models/authModels.js";
import bcrypt from "bcryptjs";

/* -------------------------------------------------------------------------- */
/*                           FUNCTION TO CREATE INITIAL USER                  */
/* -------------------------------------------------------------------------- */

async function createInitialUser() {
    try {
        const existingUser = await User.findOne({ email: process.env.ADMINEMAIL });
        if (!existingUser) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(process.env.ADMINPASSWORD, salt);
            const newUser = new User({
                name: process.env.ADMINNAME,
                email: process.env.ADMINEMAIL,
                password: hashedPassword,
                mobile: process.env.ADMINPHONE,
                role: "admin",
                permissions: []
            });

            await newUser.save();
            console.log("Initial admin user created");
        } else {
            console.log("Admin user already exists");
        }
    } catch (error) {
        console.error("Error creating user:", error);
    }
}

export default createInitialUser;