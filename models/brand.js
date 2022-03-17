const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let BrandSchema = new Schema(
    {
        name: { type: String }
    }
);

BrandSchema
.virtual('url')
.get(() => {
    return '/shop/brand/' + this._id;
});

module.exports = mongoose.model('Brand', BrandSchema);