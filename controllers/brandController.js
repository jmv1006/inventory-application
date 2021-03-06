const Brand = require('../models/brand');
const Item = require('../models/item')
const async = require('async');
const Joi = require('joi');

exports.brands_list = function(req, res) {
    Brand.find({}, (err, result) => {
        if(err) {
            console.log("Error getting brands from db")
            return
        }
        res.render('brand_list', {title: 'Brands', brands_list: result})
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
            res.render('brand_detail', {title: 'Brand Detail', brand: result.brand, brand_items: result.brand_items})
        }
    )
};

exports.get_create_brand = function (req, res) {
    res.render('brand_create', {title: 'Create Brand', errors: null, name: '', description: ''})
};

exports.post_create_brand = function (req, res) {
    const schema = Joi.object({
        brandName: Joi.string()
            .min(3)
            .messages({
                'string.min': 'Brand name must have a length of at least 3 characters.'
            }),
        brandDesc: Joi.string()
            .min(3)
            .messages({
                'string.min': 'Brand description must have a length of at least 3 characters.'
            }),
        adminCode: Joi.string()
            .valid(process.env.ADMIN_CODE)
            .required()
            .messages({
            'any.only': 'Incorrect Admin Password'
            })
    });

    const { error, value } = schema.validate(req.body, {abortEarly: false})

    if(error) {
        res.render("brand_create", { title: "Create Brand", errors: error.details, name: req.body.brandName, description: req.body.brandDesc });
        return
    }

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
};

exports.get_edit_brand = function (req, res) {

    Brand.findById(req.params.id, (err, result) => {
        res.render('brand_create', {title: 'Edit Brand', name: result.name, description: result.description, errors: null})
    });

};

exports.post_edit_brand = function (req, res) {

    const schema = Joi.object({
        brandName: Joi.string()
            .min(3)
            .messages({
                'string.min': 'Brand name must have a length of at least 3 characters.'
            }),
        brandDesc: Joi.string()
            .min(3)
            .messages({
                'string.min': 'Brand description must have a length of at least 3 characters.'
            }),
        adminCode: Joi.string()
        .valid(process.env.ADMIN_CODE)
        .required()
        .messages({
        'any.only': 'Incorrect Admin Password'
        })
    });

    const { error, value } = schema.validate(req.body, {abortEarly: false})

    if(error) {
        res.render("brand_create", { title: "Create Brand", errors: error.details, name: req.body.brandName, description: req.body.brandDesc });
        return
    }

    Brand.findById(req.params.id, (err, result) => {

        const editedBrand = new Brand({
            name: req.body.brandName,
            description: req.body.brandDesc,
            _id: req.params.id
        });

        Brand.findByIdAndUpdate(req.params.id, editedBrand, {}, (err, brand) => {
            if(err) {
                console.log('error editing brand')
                return
            }
            res.redirect(editedBrand.url)
        })
    })
};

exports.get_delete_brand = function (req, res) {
    Brand.findById(req.params.id, (err, brand) => {
        Item.find({brand: req.params.id}, (err, result) => {
            if(result.length === 0 ) {
                res.render('brand_delete', {title: 'Delete brand', brand: brand, items: null, errors: null})
            } else {
                res.render('brand_delete', {title: 'Delete brand', brand: brand, items: result, errors: null})
            };
        });
    });
};

exports.post_delete_brand = function (req, res) {

    const schema = Joi.object({
        adminCode: Joi.string()
        .valid(process.env.ADMIN_CODE)
        .required()
        .messages({
          'any.only': 'Incorrect Admin Password'
        })
    });

    const { error, value } = schema.validate(req.body, {abortEarly: false})

    if(error) {
        Brand.findById(req.params.id, (err, result) => {
            res.render("brand_delete", { title: "Delete Brand", brand: result, errors: error.details, items: null});
        })
    } else {
        Brand.findByIdAndRemove(req.params.id, (err) => {
            if(err) {
                console.log('error deleting brand')
                return
            }
            res.redirect('/inventory/brands')
        });
    }
};