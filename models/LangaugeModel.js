import mongoose from "mongoose";

/* -------------------------------------------------------------------------- */
/*                           LANGUAGE SCHEMA                                  */
/* -------------------------------------------------------------------------- */

const langaugeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now
    }
})

const Langauge = mongoose.model("Langauge", langaugeSchema);

export default Langauge;