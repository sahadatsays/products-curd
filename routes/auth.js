
const PasswordComplexity = require('joi-password-complexity');
const _ = require('lodash');
const bcrypt = require("bcrypt");
const express = require('express');
const router = express.Router();
const { User, authValidate } = require('../models/user');

router.get('/', async (req, res) => {
    const users = await User.find();
    if (!users) return res.status(404).send("404! Users not found.");

    res.send(users);
});

router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send("404! User not found.");
    res.send(user);
});


router.post('/', async (req, res) => {
    const { error } = authValidate(req.body);
    if (error) return res.status(400).send( error.message );

    /* has user */
    const user = await User.findOne({ email : req.body.email });
    if (!user) return res.status(400).send('Invalid Email and Password...');

    /* check Valid password */
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if ( !validPassword ) return res.status(400).send('Invalid Email and Password...');

    const token = user.generateAuthToken();

    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});


module.exports = router;