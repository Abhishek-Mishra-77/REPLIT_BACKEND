import mongoose from "mongoose";

/* -------------------------------------------------------------------------- */
/*                           USER   SCHEMA                                    */
/* -------------------------------------------------------------------------- */

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: null
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    permissions: {
        type: Array,
        default: []
    },
    date: {
        type: Date,
        default: Date.now
    }
});
const User = mongoose.model("User", UserSchema);
export default User