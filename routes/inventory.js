var express = require('express');
var router = express.Router();

const item_controller = require('../controllers/itemController');

/* GET home page. */
router.get('/', function(req, res) {
  res.send('Inventory goes here')
});

//<---- ITEM INSTANCE ROUTES ---->

// GET request for list of all item instances
router.get('/all', 
  item_controller.item_list
);

module.exports = router;