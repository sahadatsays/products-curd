const mongoose = require('mongoose');
const Joi = require('joi');

/* Mongoose Connect */
mongoose.connect('mongodb://localhost:27017/pos_system')
        .then( () => { console.log('MongoDB Connected '); })
        .catch( error => console.log('Could no connect to mongoDB.', error));
    
/* Make Schema */
const customerSchema = new mongoose.Schema({
    name : {
        type: String,
        minlength : 5,
        maxlength : 255,
        required : true
    },
    address : {
        type : String,
        required : true
    },
    contact : {
        type: String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    image : {
        type: String,
        default : null
    },
    post_code : {
        type : Number,
        required : true
    }
});

/* Make Model */
const Customer = mongoose.model('Customer', customerSchema);

/* Validation */
function validCustomer(req){
    const validationSchema = {
        name : Joi.string().min(5).required(),
        address : Joi.string().min(5).required(),
        contact : Joi.string().min(5).required(),
        email : Joi.string().min(5).required().email(),
        post_code : Joi.number().required()
    }
    return Joi.validate(req, validationSchema);
}

exports.Customer = Customer;
exports.validate = validCustomer;