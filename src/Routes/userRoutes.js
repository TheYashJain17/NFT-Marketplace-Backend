const express = require('express');//importing express library.

const router = express.Router(); //initialising router of the express.

const userAPIsData = require('../../Controllers/userAPIsAllData'); //importing user APIs data.

const authentication = require("../../Controllers/authenticationAllData"); //Importing the authentication file we made.


router.route('/api/v1/users/signup').post(authentication.signup); //Making a POST Route for signup of the user as user have to send information therefore making POST Route.

router.route('/api/v1/users/login').post(authentication.login); //Making a POST Route for LogIn of the user as user have to send information therefore making POST Route.


module.exports = router;