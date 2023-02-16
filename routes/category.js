var express = require('express');
var router = express.Router();
const categoryController = require('../controllers/categoryController')
const passportJWT = require('../middleware/passportJWT');
const checkAdmin = require('../middleware/checkAdmin')

/* GET users listing. */
router.get('/',categoryController.index) //Show Category
router.post('/',[passportJWT.isLogin,checkAdmin.isAdmin],categoryController.insert) //Insert Category
router.delete('/:id',[passportJWT.isLogin,checkAdmin.isAdmin],categoryController.destroy ) //Delete Category
router.get('/product',categoryController.product) //Show Product
router.get('/product/:id', categoryController.Prodshow) //Show Product by ID
router.post('/product',[passportJWT.isLogin,checkAdmin.isAdmin],categoryController.Prodinsert) //Insert Product
router.put('/product/:id',[passportJWT.isLogin,checkAdmin.isAdmin], categoryController.Produpdate ) //Update Product
router.delete('/product/:id',[passportJWT.isLogin,checkAdmin.isAdmin], categoryController.Proddestroy ) //Delete Product

module.exports = router;
