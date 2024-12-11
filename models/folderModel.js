import mongoose from "mongoose";

/* -------------------------------------------------------------------------- */
/*                           FOLDER SCHEMA                                    */
/* -------------------------------------------------------------------------- */

const folderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now
    }
})

const Folder = mongoose.model("Folder", folderSchema);

export default Folder;