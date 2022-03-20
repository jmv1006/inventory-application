const Brand = require('../models/brand');

exports.brands_list = function(req, res) {
    Brand.find({}, (err, result) => {
        if(err) {
            console.log("Error getting brands from db")
            return
        }
        res.render('brand_list', {title: 'Brands List', brands_list: result})
    })
};
