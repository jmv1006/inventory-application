const Item = require("../models/item");
const async = require("async");
const category = require("../models/category");
const brand = require("../models/brand");
var path = require("path");
const fs = require("fs");
const Joi = require("joi");

//display all item instances
exports.item_list = function (req, res) {
  Item.find({}, (err, result) => {
    if (err) {
      res.redirect("/error");
      return;
    }
    res.render("item_list", { title: "Items", item_list: result });
  });
};

//display specific item
exports.item_detail_page = function (req, res) {
  async.parallel(
    {
      item: (cb) => {
        Item.findById(req.params.id)
          .populate("category")
          .populate("brand")
          .exec(cb);
      },
    },
    (err, result) => {
      if (err) {
        res.redirect("/error");
        return;
      }

      res.render("item_detail", {
        title: "Item Detail Page",
        item: result.item,
      });
    }
  );
};

exports.create_item_page_get = function (req, res) {
  async.parallel(
    {
      categories: (cb) => {
        category.find(cb);
      },
      brands: (cb) => {
        brand.find(cb);
      },
    },
    function (err, results) {
      if (err) {
        res.redirect("/error");
        return;
      }
      res.render("create_item_page", {
        title: "Create Item",
        errors: null,
        name: '',
        description: '',
        price: '',
        inStock: '',
        categories: results.categories,
        brands: results.brands,
      });
    }
  );
};

exports.create_item_page_post = (req, res, next) => {

  const schema = Joi.object({
    itemName: Joi.string()
        .min(3)
        .messages({
            'string.min': 'Item name must have a length of at least 3 characters.'
        }),
    itemDesc: Joi.string()
        .min(3)
        .messages({
            'string.min': 'Item description must have a length of at least 3 characters.'
        }),
    itemPrice: Joi.number()
        .integer()
        .min(1)
        .messages({
          'number.min': 'Item price must be greater than 0.'
        }),
    itemInStock: Joi.number()
        .integer()
        .min(1)
        .messages({
          'number.min': 'Item in stock quantity must be greater than 0.'
        }),
    categoryName: Joi.string(),
    brandName: Joi.string()
});

  const { error, value } = schema.validate(req.body, {abortEarly: false})

  if(error) {
    async.parallel(
      {
        categories: (cb) => {
          category.find(cb);
        },
        brands: (cb) => {
          brand.find(cb);
        },
      }, (err, result) => {
        res.render("create_item_page", { title: "Create Item", errors: error.details, categories: result.categories, brands: result.brands, name: req.body.itemName, description: req.body.itemDesc, price: req.body.itemPrice, inStock: req.body.itemInStock});
    });
    return
  }

  async.parallel(
    {
      category: (cb) => {
        category.findOne({ name: req.body.categoryName }, cb);
      },
      brand: (cb) => {
        brand.findOne({ name: req.body.brandName }, cb);
      },
    },
    (err, result) => {
      if (err) {
        res.redirect("/error");
      } else {
        let newItem;

        if (req.file) {
          newItem = new Item({
            name: req.body.itemName,
            description: req.body.itemDesc,
            price: req.body.itemPrice,
            inStock: req.body.itemInStock,
            category: result.category._id,
            brand: result.brand._id,
            img: {
              data: fs.readFileSync(
                path.join(__dirname, "..", "uploads", req.file.filename)
              ),
              contentType: req.file.mimetype,
            },
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
              contentType: null,
            },
          });
        }

        newItem.save((err) => {
          if (err) {
            //err
          } else {
            res.redirect(newItem.url);
          }
        });
      }
    }
  );
};

exports.get_item_edit = function (req, res) {
  async.parallel(
    {
      item: (cb) => {
        Item.findById(req.params.id)
          .populate("category")
          .populate("brand")
          .exec(cb);
      },
      categories: (cb) => {
        category.find(cb);
      },
      brands: (cb) => {
        brand.find(cb);
      },
    },
    (err, result) => {
      if (err) {
        res.redirect("/error");
      }
      res.render("create_item_page", {
        title: "Edit Item",
        errors: null,
        name: result.item.name,
        description: result.item.description,
        price: result.item.price,
        inStock: result.item.inStock,
        categories: result.categories,
        brands: result.brands,
      });
    }
  );
};

exports.post_item_edit = function (req, res) {

  const schema = Joi.object({
    itemName: Joi.string()
        .min(3)
        .messages({
            'string.min': 'Item name must have a length of at least 3 characters.'
        }),
    itemDesc: Joi.string()
        .min(3)
        .messages({
            'string.min': 'Item description must have a length of at least 3 characters.'
        }),
    itemPrice: Joi.number()
        .integer()
        .min(1)
        .messages({
          'number.min': 'Item price must be greater than 0.'
        }),
    itemInStock: Joi.number()
        .integer()
        .min(1)
        .messages({
          'number.min': 'Item in stock quantity must be greater than 0.'
        }),
    categoryName: Joi.string(),
    brandName: Joi.string()
});

  const { error, value } = schema.validate(req.body, {abortEarly: false})

  if(error) {
    async.parallel(
      {
        categories: (cb) => {
          category.find(cb);
        },
        brands: (cb) => {
          brand.find(cb);
        },
      }, (err, result) => {
        res.render("create_item_page", { title: "Edit Item", errors: error.details, categories: result.categories, brands: result.brands, name: req.body.itemName, description: req.body.itemDesc, price: req.body.itemPrice, inStock: req.body.itemInStock});
    });
    return
  };

  async.parallel(
    {
      category: (cb) => {
        category.findOne({ name: req.body.categoryName }, cb);
      },
      brand: (cb) => {
        brand.findOne({ name: req.body.brandName }, cb);
      },
    },
    (err, result) => {
      if (err) {
        res.redirect("/error");
      }

      let updatedItem;

      if (req.file) {
        updatedItem = new Item({
          name: req.body.itemName,
          description: req.body.itemDesc,
          price: req.body.itemPrice,
          inStock: req.body.itemInStock,
          category: result.category._id,
          brand: result.brand._id,
          img: {
            data: fs.readFileSync(
              path.join(__dirname, "..", "uploads", req.file.filename)
            ),
            contentType: req.file.mimetype,
          },
          _id: req.params.id,
        });
      } else {
        updatedItem = new Item({
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
          _id: req.params.id,
        });
      }

      Item.findByIdAndUpdate(req.params.id, updatedItem, {}, (err, item) => {
        if (err) {
          console.log("error updating item");
        }
        res.redirect(item.url);
      });
    }
  );
};

exports.get_item_delete = function (req, res) {
  Item.findById(req.params.id, (err, foundItem) => {
    if (err) {
      res.redirect("/error");
    }
    res.render("item_delete", { title: "Delete Item", item: foundItem });
  });
};

exports.post_item_delete = function (req, res) {
  Item.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.redirect("/error");
    }
    res.redirect("/inventory/items");
  });
};