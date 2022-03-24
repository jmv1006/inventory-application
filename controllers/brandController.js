const Brand = require('../models/brand');
const Item = require('../models/item')
const async = require('async');

exports.brands_list = function(req, res) {
    Brand.find({}, (err, result) => {
        if(err) {
            console.log("Error getting brands from db")
            return
        }
        res.render('brand_list', {title: 'Brands List', brands_list: result})
    })
};

exports.brand_detail_page = function(req, res) {
    async.parallel({
        brand: (cb) => {
            Brand.findById(req.params.id).exec(cb);
        },
        brand_items: (cb) => {
            Item.find({'brand': req.params.id}).exec(cb);
        }
    },
        (err, result) => {
            if(err) {
                console.log('Error finding brand info')
            }
            res.render('brand_detail', {title: 'Brand Detail Page', brand: result.brand, brand_items: result.brand_items})
        }
    )
};

exports.get_create_brand = function (req, res) {
    res.render('brand_create', {title: 'Create Brand'})
};

exports.post_create_brand = function (req, res) {

    const newBrand = new Brand({
        name: req.body.brandName,
        description: req.body.brandDesc
    })

    Brand.findOne({'name': req.body.brandName}).exec((err, found_brand) => {
        if (found_brand) {
            res.redirect(found_brand.url)
        } else {
            newBrand.save((err) => {
                if(err) {
                    console.log('error saving new brand')
                    return
                }
                res.redirect(newBrand.url)
            });
        };
    })
}