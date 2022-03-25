const Item = require('../models/item');
const async = require('async')
const category = require('../models/category');
const brand = require('../models/brand');
var path = require('path');
const fs = require('fs')

//display all item instances
exports.item_list = function (req,res) {  
    Item.find({}, (err, result) => {
        if(err) {
            return
        }
        res.render('item_list', {title: 'Items', item_list: result});
    });
};

//display specific item
exports.item_detail_page = function(req, res) {
    async.parallel({
        item: (cb) => {
            Item.findById(req.params.id)
            .populate('category')
            .populate('brand')
            .exec(cb);
        }
    },
    
        (err, result) => {
            if(err) {
                return
            }
            
            res.render('item_detail', {title: 'Item Detail Page', item: result.item})
        }
    )
};

exports.create_item_page_get = function (req, res) {
   async.parallel({
       categories: (cb) => {
           category.find(cb)
       },
       brands: (cb) => {
           brand.find(cb)
       },
   }, function(err, results) {
        res.render('create_item_page', {title: 'Create Item', errors: null, categories: results.categories, brands: results.brands})
   });

};


exports.create_item_page_post = (req, res, next) => {
    async.parallel({
        category: (cb) => {
            category.findOne({ name: req.body.categoryName}, cb)
        },
        brand: (cb) => {
            brand.findOne({name: req.body.brandName}, cb)
        },
    }, (err, result) => {
        if(err) {
            
        } else {

            let newItem; 

            if(req.file) {
                newItem = new Item({
                    name: req.body.itemName,
                    description: req.body.itemDesc,
                    price: req.body.itemPrice,
                    inStock: req.body.itemInStock,
                    category: result.category._id,
                    brand: result.brand._id,
                    img: {
                        data: fs.readFileSync(path.join(__dirname, '..', 'uploads', req.file.filename)),
                        contentType: req.file.mimetype
                    }
                });
            } else {
                newItem = new Item({
                    name: req.body.itemName,
                    description: req.body.itemDesc,
                    price: req.body.itemPrice,
                    inStock: req.body.itemInStock,
                    category: result.category._id,
                    brand: result.brand._id,
                    img: {
                        data: null,
                        contentType: null
                    }
                });
            };
           
            
            newItem.save((err) => {
                if (err) {
                    //err
                } else {
                    res.redirect(newItem.url);
                }
            })
        }
    });
    
};
         
exports.get_item_edit = function (req, res) {
    async.parallel({
        item: (cb) => {
            Item.findById(req.params.id)
            .populate('category')
            .populate('brand')
            .exec(cb);
        },
        categories: (cb) => {
            category.find(cb)
        },
        brands: (cb) => {
            brand.find(cb)
        }
    },
        (err, result) => {
            if(err) {
                return
            }
            res.render('item_edit', {title: 'Edit Item', item: result.item, categories: result.categories, brands: result.brands})
        }
    )
};

exports.post_item_edit = function(req, res) {
    
    async.parallel({
        category: (cb) => {
            category.findOne({name: req.body.categoryName}, cb)
        },
        brand: (cb) => {
            brand.findOne({name: req.body.brandName}, cb)
        }
    },  
        (err, result) => {
            if(err) {
                console.log('Error finding items')
                return
            }
            
            let updatedItem;
            
            if(req.file) {
                updatedItem =  new Item({
                    name: req.body.itemName,
                    description: req.body.itemDesc,
                    price: req.body.itemPrice,
                    inStock: req.body.itemInStock,
                    category: result.category._id,
                    brand: result.brand._id,
                    img: {
                        data: fs.readFileSync(path.join(__dirname, '..', 'uploads', req.file.filename)),
                        contentType: req.file.mimetype
                    },
                    _id: req.params.id
                });
            } else {
                updatedItem =  new Item({
                    name: req.body.itemName,
                    description: req.body.itemDesc,
                    price: req.body.itemPrice,
                    inStock: req.body.itemInStock,
                    category: result.category._id,
                    brand: result.brand._id,
                    img: {
                        data: null,
                        contentType: null,
                    },
                    _id: req.params.id
                });
            };
            
            Item.findByIdAndUpdate(req.params.id, updatedItem, {}, (err, item) => {
                if(err) {
                    console.log('error updating item')
                }
                res.redirect(item.url)
            });
        }
    );
};

exports.get_item_delete = function (req, res) {
  
    Item.findById(req.params.id, (err, foundItem) => {
        if(err) {
            console.log('error finding item')
            return
        }
        res.render('item_delete', {title: 'Delete Item', item: foundItem})
    });

};

exports.post_item_delete = function (req, res) {
    Item.findByIdAndRemove(req.params.id, (err) => {
        if(err) {
            console.log('error deleting item')
            return
        }
        res.redirect('/inventory/items')
    });
};