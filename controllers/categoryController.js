const Category = require("../models/category");
const async = require("async");
const Item = require("../models/item");
const Joi = require('joi');

exports.category_list = function (req, res) {
  Category.find({}, (err, result) => {
    if (err) {
      console.log("error occured getting categories");
      return;
    }
    res.render("category_list", {
      title: "Categories",
      categories_list: result,
    });
  });
};

exports.category_detail_page = function (req, res) {
  async.parallel(
    {
      category: (cb) => {
        Category.findById(req.params.id).exec(cb);
      },

      category_items: (cb) => {
        Item.find({ category: req.params.id }).exec(cb);
      },
    },
    (err, results) => {
      if (err) {
        console.log("error");
      }
      res.render("category_detail", {
        title: "Category Detail",
        category: results.category,
        category_items: results.category_items,
      });
    }
  );
};

exports.create_category_page = function (req, res) {
  res.render("create_category", { title: "Create a category", errors: null, name: '', description: '' });
};

exports.create_category_post =  (req, res, next) => {

    const schema = Joi.object({
        categoryName: Joi.string()
            .min(3)
            .messages({
                'string.min': 'Category name must have a length of at least 3 characters.'
            }),
        categoryDesc: Joi.string()
            .min(3)
            .messages({
                'string.min': 'Category description must have a length of at least 3 characters.'
            }),
        adminCode: Joi.string()
            .valid(process.env.ADMIN_CODE)
            .required()
            .messages({
              'any.only': 'Incorrect Admin  Password'
            })
    });

    const { error, value } = schema.validate(req.body, {abortEarly: false})

    if(error) {
        res.render("create_category", { title: "Create a category", errors: error.details, name: req.body.categoryName, description: req.body.categoryDesc });
        return
    }

    let newCategory = new Category({
      name: req.body.categoryName,
      description: req.body.categoryDesc,
    });

    Category.findOne({ name: req.body.categoryName }).exec(
    (err, found_category) => {
        if (found_category) {
        //Category exists
        res.redirect(found_category.url);
        } else {
        newCategory.save((err) => {
            if (err) {
            //error saving category
            }
            res.redirect(newCategory.url);
        });
        }
  });
};

exports.get_category_edit = function (req, res) {
  Category.findById(req.params.id, (err, result) => {
    res.render("create_category", {
      title: "Edit Category",
      name: result.name,
      description: result.description,
      errors: null
    });
  });
};

exports.post_category_edit = function (req, res) {

    const schema = Joi.object({
        categoryName: Joi.string()
            .min(3)
            .messages({
                'string.min': 'Category name must have a length of at least 3 characters.'
            }),
        categoryDesc: Joi.string()
            .min(3)
            .messages({
                'string.min': 'Category description must have a length of at least 3 characters.'
            }),
        adminCode: Joi.string()
        .valid(process.env.ADMIN_CODE)
        .required()
        .messages({
          'any.only': 'Incorrect Admin  Password'
        })
    });

    const { error, value } = schema.validate(req.body, {abortEarly: false})

    if(error) {
        res.render("create_category", { title: "Edit Category", errors: error.details, name: req.body.categoryName, description: req.body.categoryDesc });
        return
    }

  Category.findById(req.params.id, (err, result) => {
    const updatedCategory = new Category({
      name: req.body.categoryName,
      description: req.body.categoryDesc,
      _id: req.params.id,
    });

    Category.findByIdAndUpdate(
      req.params.id,
      updatedCategory,
      {},
      (err, category) => {
        if (err) {
          console.log("Error updating category");
          return;
        }
        res.redirect(category.url);
      }
    );
  });
};

exports.get_category_delete = function (req, res) {
  Category.findById(req.params.id, (err, result) => {
    Item.find({ category: req.params.id }, (err, items) => {
      if(err) {
        res.redirect('/error')
      }
      if (items.length === 0) {
        res.render("category_delete", {
          title: "Delete Category",
          category: result,
          items: null,
          errors: null
        });
      } else {
        res.render("category_delete", {
          title: "Delete Category",
          category: result,
          items: items,
          errors: null
        });
      };
    });
  });
};

exports.post_category_delete = function (req, res) {
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
    Category.findById(req.params.id, (err, result) => {
      res.render("category_delete", { title: "Delete Category", items: null, errors: error.details, category: result })
    });
    return
  } else {
    Category.findByIdAndRemove(req.params.id, (err) => {
      if (err) {
        console.log("error deleting category");
        return;
      }
      res.redirect("/inventory/categories");
    });
  }
};
