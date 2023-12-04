const mongoose = require('mongoose');

const borrowSchema = mongoose.Schema({
    borrowItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BorrowItem',
        required:true
    }],
    status: {
        type: String,
        required: true,
        default: 'Pending',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    dateBorrowed: {
        type: Date,
        default: Date.now,
    },
    dateReturned: {
        type: Date,
        default: null
    },
})

borrowSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

borrowSchema.set('toJSON', {
    virtuals: true,
});

exports.Borrow = mongoose.model('Borrow', borrowSchema);

