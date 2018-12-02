/* required package */
const config = require('config');
const express = require('express');
/* Routes */

const auth = require('./routes/auth');
const products = require('./routes/products');
const customers = require('./routes/customers');
const users = require('./routes/users');

/* Check JWT private Key */
if (!config.get("jwtPrivateKey")){
    console.log("Fattal Error !");
    process.exit(1);
}
/* Create Instance */
const app = express();

/* Used */
app.use(express.json());

/* User Route */
app.get('/', (req, res) => {
    var homeContent = {
        name : "Home Page",
        content : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis, voluptatum unde? Accusantium perferendis fugit, dicta aliquam iusto reprehenderit eius repellat accusamus laboriosam labore nesciunt debitis inventore vel, fugiat, assumenda ut"
    }
    res.send(homeContent);
});
app.use('/api/products', products);
app.use('/api/customers', customers);
app.use('/api/users', users);
app.use('/api/auth', auth);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});