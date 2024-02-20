const mongoose = require('mongoose')

const wasteSchema = new mongoose.Schema({
    point:{
        type:Number,
        default: 0
    },
    userName:{
        type:String,
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true
    },
      date:{
        type: Date,
        required: true
    },
    weight:{
        type: Number,
        default: 0
    },
    status:{
        type: String,
        default: "Pending"
    },
    chid:{
        type: String,
        required: true

    }
})

const waste = mongoose.model("waste", wasteSchema);
module.exports = waste;