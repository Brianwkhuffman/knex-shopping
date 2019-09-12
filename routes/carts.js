const express = require('express');
const cartsRouter = express.Router();

cartsRouter.get('/', (req, res) => {
    res.send('Cart');
});
module.exports = cartsRouter;