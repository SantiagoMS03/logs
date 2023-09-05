const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logSchema = new Schema({
    title: String,
    body: String,
    timePracticed: Number,
    efficiency: Number,
    piece:  {
        type: Schema.Types.ObjectId,
        ref: 'Piece'
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model("Log", logSchema);