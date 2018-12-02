const mongoose = require('mongoose');
const Joi = require('joi');

/* Mongoose Connect */
mongoose.connect('mongodb://localhost:27017/pos_system')
        .then( () => { console.log('MongoDB Connected '); })
        .catch( error => console.log('Could no connect to mongoDB.', error));

/* Make Schema */
const productSchema = new mongoose.Schema({
    product_name : {
        type : String,
        required : true
    },
    category : {
        type : Number,
        required : true
    },
    barcode_number : String,
    buy_price : Number,
    sell_price : Number,
    brand_id : Number,
    produce_date : String,
    date_over : String,
    created_at : {
        type : Date,
        default : new Date()
    },
    isPublished : {
        type : Boolean,
        default : true,
        required : true
    }
});

/* Make Model */
const Product = mongoose.model('Product', productSchema);

/* Inpur Validation */
function validateProduct(product) {
    const schema = {
        product_name : Joi.string().min(5).required(),
        category : Joi.number().required(),
        barcode_number : Joi.string().required(),
        buy_price : Joi.number().required(),
        sell_price : Joi.number().required(),
        brand_id : Joi.number().required(),
        produce_date : Joi.string().required(),
        date_over : Joi.string().required(),
        isPublished : Joi.bool().required()
    };

    return Joi.validate(product, schema);
}

exports.validate = validateProduct;
exports.Product = Product;