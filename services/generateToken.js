import jwt from "jsonwebtoken";


/* -------------------------------------------------------------------------- */
/*                           JSON WEB TOKEN CONFIGURATION                     */
/* -------------------------------------------------------------------------- */

export const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};
