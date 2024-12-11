import mongoose from "mongoose";

/* -------------------------------------------------------------------------- */
/*                           FILE SCHEMA                                      */
/* -------------------------------------------------------------------------- */

const fileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    folderId : {
        type: String
    },
    createAt: {
        type: Date,
        default: Date.now
    }
})

const File = mongoose.model("File", fileSchema);

export default File;