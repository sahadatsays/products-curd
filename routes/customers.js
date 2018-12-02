const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const { Customer, validate } = require('../models/customer')

router.get('/', auth, async (req, res) => {
    const customers = await Customer.find();
    res.send(customers);
});

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send("Customer not found ! 404");

    res.send(customer);
});

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    
    if(error) return res.status(400).send(error.message);
    
    let customer = new Customer({
        name : req.body.name,
        address : req.body.address,
        contact : req.body.contact,
        email : req.body.email,
        post_code : req.body.post_code
    });
    customer = await customer.save();

    res.send(customer);
});

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    
    if (error) return res.status(400).send(error.message);

    let update_data = {
        name : req.body.name,
        address : req.body.address,
        contact : req.body.contact,
        email : req.body.email,
        post_code : req.body.post_code
    };
    let customer = await Customer.findByIdAndUpdate(req.params.id, update_data);

    if (!customer) return res.status(404).send("Customer not found !");

    res.send(customer);
});

router.delete('/:id', async (req, res) => {
    let customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer) return res.status(404).send("Customer not found ! ");
    
    res.send(customer);
});

module.exports = router;