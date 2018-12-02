const express = require('express');
const router = express.Router();
const { Product, validate } = require('../models/product');

router.get('/', async (req, res) => {
    const products = await Product.find().sort({created_at : -1});
    res.send(products);
});

router.post('/', async (req, res) => {
    const { error }  = validate(req.body);
    if (error) return res.status(400).send( error.message );
        /* Make new product */
        let product = new Product({
            product_name : req.body.product_name,
            category : req.body.category,
            barcode_number : req.body.barcode_number,
            buy_price : req.body.buy_price,
            sell_price : req.body.sell_price,
            brand_id : req.body.brand_id,
            produce_date : req.body.produce_date,
            date_over : req.body.date_over,
            isPublished : req.body.isPublished
        });
        /* Save data */
        product = await product.save();
        
    res.send(product);
});

router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    if(!product) return res.status(400).send('Do not found any information !');
    res.send(product);
});

router.put('/:id', async (req, res) => {
    const { error }  = validate(req.body);
    if (error) return res.status(400).send( error.message );
        const product = {
            product_name : req.body.product_name,
            category : req.body.category,
            barcode_number : req.body.barcode_number,
            buy_price : req.body.buy_price,
            sell_price : req.body.sell_price,
            brand_id : req.body.brand_id,
            produce_date : req.body.produce_date,
            date_over : req.body.date_over,
            isPublished : req.body.isPublished
        };
        let result = await Product.findByIdAndUpdate(req.params.id, product);

    if(!result) return res.status(404).send('Do not found any information !');

    res.send(result);

});

router.delete('/:id', async (req, res) => {
    const product = await Product.findByIdAndRemove(req.params.id);
    
    if(!product) return res.status(400).send('Do not found any information !');

    res.send(product);

});

module.exports = router;