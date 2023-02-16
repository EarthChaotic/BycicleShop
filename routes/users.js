var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')
const { body } = require('express-validator');
const passportJWT = require('../middleware/passportJWT');

/* GET users listing. */
router.post('/',[body('name').not().isEmpty().withMessage("Please enter name/sirname"), 
                body('email').not().isEmpty().withMessage("Please enter Email").isEmail().withMessage("Invalid Email type"),
                body('password').not().isEmpty().withMessage("Please enter password").isLength({min:5}).withMessage("Password must more than 5 length")
                ],userController.register) //Register

router.post('/login',[body('email').not().isEmpty().withMessage("Please enter Email").isEmail().withMessage("Invalid Email type"),
body('password').not().isEmpty().withMessage("Please enter password").isLength({min:5}).withMessage("Password must more than 5 length")
],userController.login) //Login

router.get('/Profile',[passportJWT.isLogin],userController.profile); //User's Profile

module.exports = router;
