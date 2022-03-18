const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CategorySchema = new Schema(
    {
        name: { type: String },
        description: { type: String }
    }
);

CategorySchema
.virtual('url')
.get(() => {
    return '/inventory/category/' + this._id;
});

module.exports = mongoose.model('Category', CategorySchema);