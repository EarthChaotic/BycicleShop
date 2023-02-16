var express = require('express');
var router = express.Router();
const shopController = require('../controllers/shopController')
const { body} = require('express-validator');

/* GET users listing. */
router.get('/', shopController.index )
router.get('/menu',shopController.menu)
router.get('/:id', shopController.show )
router.post('/',[
    body("name").not().isEmpty().withMessage("Please insert name"),
    body("location").not().isEmpty().withMessage("Please insert location"),
    body("location.lat").isNumeric().withMessage("Please insert number lat"),
    body("location.lgn").isNumeric().withMessage("Please insert number lgn")
], shopController.insert);

module.exports = router;
