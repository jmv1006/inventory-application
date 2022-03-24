const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let BrandSchema = new Schema(
    {
        name: { type: String },
        description: { type: String }
    }
);

BrandSchema
.virtual('url')
.get(function() {
    return '/inventory/brands/' + this._id;
});

module.exports = mongoose.model('Brand', BrandSchema);