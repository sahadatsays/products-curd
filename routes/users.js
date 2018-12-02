
const PasswordComplexity = require('joi-password-complexity');
const _ = require('lodash');
const bcrypt = require("bcrypt");
const express = require('express');
const router = express.Router();
const { User, validate } = require('../models/user');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
    const users = await User.find();
    if (!users) return res.status(404).send("404! Users not found.");
    res.send(users);
});

router.get('/:me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});


router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send( error.message );
    /* Duplicate email validation */
    let user = await User.findOne({ email : req.body.email });
    if (user) return res.status(400).send('User already created...');
    /* post data */
    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    /* Hash password */
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(req.body.password, salt);
    user.password = hashed;
    /* save data */
    await user.save();
    /* return */
    const token = user.generateAuthToken(); // generated auth token
    res.send(_.pick(user, ['_id','name', 'email']));
});

router.put('/:id', async (req, res) => {
    
    const { error } = validate(req.body);

    if (error) return res.status(400).send(error.message);
    /* password hashed */
    const salt = await bcrypt.genSalt(10);
    const passwordHased = await bcrypt.hash(req.body.password, salt);
    let updateData = {
        name: req.body.name,
        email: req.body.email,
        password: passwordHased
    };
    let user = await User.findByIdAndUpdate(req.params.id, updateData);
    
    if (!user) return res.status(400).send("Do not update data...");

    res.send(_.pick(user, ['_id', 'name', 'email']));
});

router.delete('/:id', async (req, res) => {
    const user = await User.findByIdAndRemove(req.params.id);
    if (!user) return res.status(400).send("Do no complete Delete Operation...");
    res.send(user);
});


module.exports = router;