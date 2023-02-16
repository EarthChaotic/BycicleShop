var express = require('express');
var router = express.Router();
const categoryController = require('../controllers/categoryController')

/* GET users listing. */
router.get('/',categoryController.index) //Show Category
router.post('/',categoryController.insert) //Insert Category
router.delete('/:id', categoryController.destroy ) //Delete Category
router.get('/product',categoryController.product) //Show Product
router.get('/product/:id', categoryController.Prodshow) //Show Product by ID
router.post('/product',categoryController.Prodinsert) //Insert Product
router.put('/product/:id', categoryController.Produpdate ) //Update Product
router.delete('/product/:id', categoryController.Proddestroy ) //Delete Product

module.exports = router;
