const Category = require('../models/category');
const async = require('async');
const Item = require('../models/item');
const { body, validationResult, check } = require('express-validator');

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
            res.render('category_detail', {title: 'Category Detail',  category: results.category, category_items: results.category_items})
        }
    );
};

exports.create_category_page = function (req, res) {
    res.render('create_category', {title: 'Create a category', errors: null})
};


exports.create_category_post = [

    body('categoryName', 'Input Category Name').trim().isLength({min: 3}).escape(),
    body('categoryDesc', 'Input Category Desc').trim().isLength({min: 3}).escape(),
    (req, res, next) => {
        const errors = validationResult(req);

        console.log(req.file.path)

        let newCategory = new Category({
            name: req.body.categoryName,
            description: req.body.categoryDesc
        });

        if (!errors.isEmpty()) {
            //there are errors
            res.render('create_category', {title: 'Create a category', errors: errors.array()});
            console.log('Not valid')
            return
        }
        else {
            Category.findOne({ 'name': req.body.categoryName }).exec((err, found_category) => {
                if(found_category) {
                    //Category exists
                    res.redirect(found_category.url)
                } else {
                    newCategory.save((err) => {
                        if(err) {
                            //error saving category
                        }
                        res.redirect(newCategory.url)
                    })
                }
        
        
            })
        }
    }
]

exports.get_category_edit = function(req, res) {
    Category.findById(req.params.id, (err, result) => {
        res.render('edit_category', {title: 'Edit Category', name: result.name, description: result.description})
    });
};

exports.post_category_edit = function(req, res) {

    Category.findById(req.params.id, (err, result) => {

        const updatedCategory = new Category({
            name: req.body.categoryName,
            description: req.body.categoryDesc,
            _id: req.params.id
        });
        
        Category.findByIdAndUpdate(req.params.id, updatedCategory, {}, (err, category) => {
            if(err) {
                console.log('Error updating category')
                return
            }
            res.redirect(category.url);
        });
        
    })
};

exports.get_category_delete = function(req, res) {
    
    Category.findById(req.params.id, (err, result) => {
        Item.find({category: req.params.id}, (err, items) => {
            if(items.length === 0) {
                res.render('category_delete', {title: 'Delete Category', category: result, items: null})
            }
            else {
                res.render('category_delete', {title: 'Delete Category', category: result, items: items})
            }
        });
    });
};

exports.post_category_delete = function(req, res) {
    Category.findByIdAndRemove(req.params.id, (err) => {
        if(err) {
            console.log('error deleting category')
            return
        }
        res.redirect('/inventory/categories')
    });
};
