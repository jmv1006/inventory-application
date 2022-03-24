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

router.get('/items/:id/edit',
  item_controller.get_item_edit
)

router.post('/items/:id/edit',
  item_controller.post_item_edit
)

router.get('/items/:id/delete',
  item_controller.get_item_delete
);

router.post('/items/:id/delete',
  item_controller.post_item_delete
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

//Create categeory Edit
router.get('/categories/:id/edit',
  category_controller.get_category_edit
)

//category edit POST
router.post('/categories/:id/edit', 
  category_controller.post_category_edit
)

//GET category delete page
router.get('/categories/:id/delete',
  category_controller.get_category_delete
)

//POST category delete
router.post('/categories/:id/delete',
  category_controller.post_category_delete
)

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