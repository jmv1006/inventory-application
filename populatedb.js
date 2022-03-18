const items = [];
const categories = [];
const brands = [];

const async = require('async');
const Item = require('./models/item');
const Category = require('./models/category');
const Brand = require('./models/brand');

//Set up mongoose connection
var mongoose = require('mongoose');
var mongoDB = 'mongodb+srv://jmv1006:<password>@inventory-application.zk82v.mongodb.net/inventory-application?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


function categoryCreate(name, description, cb) {
    let categoryDetail = {name: name, description: description};

    const category = new Category(categoryDetail);

    category.save((err) => {
        if(err) {
            return
        }
        console.log('New Category ' + category);
        categories.push(category)
        cb(null, category)
    });
};

function brandCreate(name, cb) {
    let brandDetail = {name: name};

    const brand = new Brand(brandDetail);

    brand.save((err) => {
        if(err) {
            cb(err, null)
            return
        }
        console.log('New Brand' + brand);
        brands.push(brand)
        cb(null, brand)
    });
};

function itemCreate(name, category, price, description, brand, inStock, cb) {
    let itemDetail = {
        name: name,
        category: category,
        price: price,
        description: description,
        brand: brand,
        inStock: inStock
    }

    const item = new Item(itemDetail);

    item.save((err) => {
        if(err) {
            cb(err, null)
            return
        }
        console.log('New item' + item);
        items.push(item);
        cb(null, item);
    });
};


function createCategoriesAndBrands(cb) {
    async.series([
        (callback) => {
            categoryCreate('Computers', 'Computers for your everyday needs.', callback);
        },
        (callback) => {
            categoryCreate('Tablets', 'Power and productivity on the go', callback);
        },
        (callback) => {
            categoryCreate('Phones', 'One of the most powerful machines that mankind has made. In your pocket.', callback);
        },
        (callback) => {
            categoryCreate('Gaming Systems','With all the power you need, these systems are sure to fufill your gaming needs', callback);
        },
        (callback) => {
            brandCreate('Microsoft', callback);
        },
        (callback) => {
            brandCreate('Apple', callback);
        },
        (callback) => {
            brandCreate('Sony', callback);
        },
        (callback) => {
            brandCreate('Samsung', callback);
        },
    ],
    cb);
};

function createItems(cb) {
    async.parallel([
        (callback) => {
            itemCreate('Macbook Air', categories[0], 999.00, 'A lightweight computer for your everyday needs.', brands[1], 6, callback);
        },
        (callback) => {
            itemCreate('Surface Tablet', categories[1], 599.00, 'Windows on the go.', brands[0], 4, callback);
        },
        (callback) => {
            itemCreate('Playstation 5', categories[3], 499.00, 'Power to the players. With a lightning fast SSD and ground breaking graphics, the PS5 truly is revolutionary.', brands[2], 2, callback);
        },
        (callback) => {
            itemCreate('Galaxy S21+ Ultra', categories[2], 1099.00, 'With the best camera on any smartphone, this is a gamechanger.', brands[3], 1, callback);
        },
    ],
    cb)
};

async.series([
    createCategoriesAndBrands,
    createItems
],
(err, results) => {
    if (err) {
        console.log('Final err: ' + err)
    } else {
        console.log('Items: ' + items)
    };
    //All done, disconnect from db
}
);



