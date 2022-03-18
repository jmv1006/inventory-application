const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ItemSchema = new Schema(
    {
        name: { type: String },
        category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
        price: { type: Number },
        description: { type: String },
        brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
        inStock: { type: Number}
    }
);

ItemSchema
.virtual('url')
.get(() => {
    return '/inventory/item/' + this._id;
});

module.exports = mongoose.model('Item', ItemSchema);