const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CategorySchema = new Schema(
    {
        name: { type: String },
        description: { type: String }
    }
);

CategorySchema.virtual('url').get(function() {
    return '/inventory/categories/' + this._id;
});

module.exports = mongoose.model('Category', CategorySchema);