const mongoose = require("mongoose");

const ratesSchema = new mongoose.Schema({
    source: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    buy: {
        type: String,
        required: true,
    },
    sell: {
        type: String,
        required: true,
    },
    timestamp: {
        type: String,
        required: true,
    }
});

const Rate = mongoose.model("Rate", ratesSchema);

module.exports = Rate;