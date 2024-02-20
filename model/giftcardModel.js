const mongoose = require('mongoose')

const giftcardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    point_need: {
        type: Number,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    isUnlocked:{
        type: Boolean,
        default: false
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true
    }
})

const giftcard = mongoose.model("giftcard", giftcardSchema);
module.exports = giftcard;