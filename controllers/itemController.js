const Item = require('../models/item');

//display all item instances
exports.item_list = function (req,res) {  
    Item.find({}, (err, result) => {
        if(err) {
            console.log('error')
            return
        }
        res.render('item_list', {title: 'All Items', item_list: result});
    });
};





