const mongoose = require('mongoose')

const wasteSchema = new mongoose.Schema({
    point: {
        type: Number,
        default:0
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true
    },
})

const point = mongoose.model("point", wasteSchema);
module.exports = point;