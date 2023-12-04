const mongoose = require('mongoose');

const borrowItemSchema = mongoose.Schema({
    quantity: {
        type: Number,
        required: true
    },
    tool: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tool'
    }
})

borrowItemSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

borrowItemSchema.set('toJSON', {
    virtuals: true,
});

exports.BorrowItem = mongoose.model('BorrowItem', borrowItemSchema);

