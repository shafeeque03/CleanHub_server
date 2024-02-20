const mongoose = require('mongoose')

const uniqueGiftcardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    point_need: {
        type: Number,
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
})

const uniqueGiftcard = mongoose.model("uniqueGiftcard", uniqueGiftcardSchema);
module.exports = uniqueGiftcard;