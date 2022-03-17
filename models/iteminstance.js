const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ItemInstanceSchema = new Schema(
    {
        item: {type: Schema.Types.ObjectId, ref: 'Item', required: true},
        inStock: { type: Number }
    }
);

ItemInstanceSchema
.virtual('url')
.get(() => {
    return '/shop/iteminstance/' + this._id;
});

module.exports = mongoose.model('ItemInstance', ItemInstanceSchema)