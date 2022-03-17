const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CategorySchema = new Schema(
    {
        name: { type: String },
        url: { type: String },
        description: { type: String }
    }
);

CategorySchema
.virtual('url')
.get(() => {
    return '/shop/category/' + this._id;
});

module.exports = mongoose.model('Category', CategorySchema);