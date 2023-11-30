const mongoose = require('mongoose');
const Log = require('./log');
const Schema = mongoose.Schema;

const PieceSchema = new Schema({
    name: String,
    composer: String,
    era: String,
    instrument: String,
    length: Number,
    numLogs: Number,
    sheetMusic: [{
        url: String,
        filename: String
    }],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    logs: [{
        type: Schema.Types.ObjectId,
        ref: 'Log'
    }],
    knowsThis: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

    PieceSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Log.deleteMany({
            _id: {
                $in: doc.logs
            }
        })
    }
})

module.exports = mongoose.model('Piece', PieceSchema)