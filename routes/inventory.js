var express = require('express');
var router = express.Router();

const item_controller = require('../controllers/itemController');
const category_controller = require('../controllers/categoryController');
const brand_controller = require('../controllers/brandController')

/* GET home page. */
router.get('/', function(req, res) {
  res.render('inventory_main_page', {title: 'Welcome to your app'})
});

//<---- ITEM INSTANCE ROUTES ---->

// GET request for list of all item instances
router.get('/items', 
  item_controller.item_list
);

router.get('/items/create',
  item_controller.create_item_page_get
)

router.post('/items/create',
  item_controller.create_item_page_post
)

router.get('/items/:id',
  item_controller.item_detail_page
)




//<--- CATEGORIES ROUTE ---->
//GET request for listing all categories
router.get('/categories',
  category_controller.category_list
);

//Create category GET
router.get('/categories/create',
  category_controller.create_category_page
);

//Create category POST
router.post('/categories/create',
  category_controller.create_category_post
);

router.get('/categories/:id',
  category_controller.category_detail_page
);

//<---- BRANDS ROUTE ---->
//GET request for listing all brands
router.get('/brands', 
  brand_controller.brands_list
)

router.get('/brands/:id',
  brand_controller.brand_detail_page
)

module.exports = router;