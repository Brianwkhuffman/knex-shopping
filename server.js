const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// const db = require('./database');

const cartsRoute = require('./routes/carts');
const productsRoute = require('./routes/products');
const usersRoute = require('./routes/users');
const PORT = 8080;


app.use(bodyParser.json());

app.use('/carts', cartsRoute);
app.use('/products', productsRoute);
app.use('/users', usersRoute);

app.get('/', (req, res) => {
    res.send('Home page boi')
});

app.listen(PORT, () => {
    console.log(`Server started on PORT ${PORT}...`)
});