const Item = require('../models/item');

//display all item instances
exports.item_list = function (req,res) {  
    Item.find({}, (err, result) => {
        if(err) {
            console.log('error')
        }
        res.send(result)
    });
};





