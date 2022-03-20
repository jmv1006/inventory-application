const Item = require('../models/item');
const async = require('async')

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
            console.log(result)
            if(err) {
                console.log('error finding item')
            }

            res.render('item_detail', {title: 'Item Detail Page', item: result.item})
        }
    )
};





