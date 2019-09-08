const express = require('express');
const productsRouter = express.Router();

productsRouter.get('/', (req, res) => {
    res.send('Products');
});
module.exports = productsRouter;