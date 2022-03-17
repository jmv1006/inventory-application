const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ItemInstanceSchema = new Schema(
    {
        name: { type: String },
        category: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
        price: { type: Number },
        description: { type: string },
        brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
        inStock: { type: Number },
        url: { type: String }
    }
);

ItemInstanceSchema
.virtual('url')
.get(() => {
    return '/shop/item/' + this._id;
});

module.exports = mongoose.model('Item', ItemInstanceSchema)