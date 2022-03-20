var express = require('express');
var router = express.Router();

const item_controller = require('../controllers/itemController');
const category_controller = require('../controllers/categoryController');
const brand_controller = require('../controllers/brandController')

/* GET home page. */
router.get('/', function(req, res) {
  res.send('Inventory goes here')
});

//<---- ITEM INSTANCE ROUTES ---->

// GET request for list of all item instances
router.get('/items', 
  item_controller.item_list
);

router.get('/items/:id',
  item_controller.item_detail_page
)

//GET request for listing all categories
router.get('/categories',
  category_controller.category_list
);

router.get('/categories/:id',
  category_controller.category_detail_page
);

//GET request for listing all brands
router.get('/brands', 
  brand_controller.brands_list
)

module.exports = router;