var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')
const { body } = require('express-validator');
const passportJWT = require('../middleware/passportJWT');

/* GET users listing. */
router.get('/', userController.index )
router.get('/bio', userController.bio)
router.post('/',[body('name').not().isEmpty().withMessage("Please enter name/sirname"), 
                body('email').not().isEmpty().withMessage("Please enter Email").isEmail().withMessage("Invalid Email type"),
                body('password').not().isEmpty().withMessage("Please enter password").isLength({min:5}).withMessage("Password must more than 5 length")
                ],userController.register)

router.post('/login',[body('email').not().isEmpty().withMessage("Please enter Email").isEmail().withMessage("Invalid Email type"),
body('password').not().isEmpty().withMessage("Please enter password").isLength({min:5}).withMessage("Password must more than 5 length")
],userController.login)

router.get('/me',[passportJWT.isLogin],userController.profile);

module.exports = router;
