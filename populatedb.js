//Set up mongoose connection
var mongoose = require('mongoose');
var mongoDB = 'mongodb+srv://jmv1006:rosieval1006@inventory-application.zk82v.mongodb.net/inventory-application?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
