const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

/* Make Connection */
mongoose.connect('mongodb://localhost:27017/pos_system')
        .then( () => { console.log('MongoDB Connected '); })
        .catch( error => console.log('Could no connect to mongoDB.', error));

/* Design Schema */
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        minlength : 5
    },
    password : {
        type : String,
        minlength: 5,
        maxlength : 1024,
        required: true
    },
    email : {
        type: String,
        required : true
    },
    created_at : {
        type : Date,
        default : Date.now
    }
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id : this._id  }, config.get("jwtPrivateKey"));
    return token;
}


/* Make Model */
const User = mongoose.model('User', userSchema);

/* Validation */
function userValidation (req) {
    const schema = {
        name : Joi.string().min(5).required(),
        password : Joi.string().min(5).required(),
        email : Joi.string().email().required()
    };

    return Joi.validate(req, schema);
}

function authValidate (req) {
    const schema = {
        password : Joi.string().min(5).required(),
        email : Joi.string().email().required()
    };

    return Joi.validate(req, schema);
}

exports.User = User;
exports.validate = userValidation;
exports.authValidate = authValidate;