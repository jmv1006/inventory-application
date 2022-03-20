const Category = require('../models/category');
const async = require('async');
const Item = require('../models/item')

exports.category_list = function (req, res) {
    Category.find({}, (err, result) => {
        if(err) {
            console.log('error occured getting categories')
            return
        }
        res.render('category_list', {title: 'Categories', categories_list: result});
    })
}

exports.category_detail_page = function (req, res) {
    
    async.parallel({
        category: (cb) => {
            Category.findById(req.params.id).exec(cb);
        },

        category_items: (cb) => {
            Item.find({'category': req.params.id}).exec(cb)
        }
    },
        (err, results) => {
            if(err) {
                console.log('error')
            }
            res.render('category_detail', {title: 'Category Detail', category: results.category, category_items: results.category_items})
        }
    );
};