require('dotenv').config(); //with this statement we are getting all the information which is present inside our env file.Always remember to use .config to read all the data of the env file.

const mongoose = require('mongoose'); //requiring mongoose to make a connection with the help of it.


/*With the help of mongoose.connect we are intitialising the connection of our application with the database.
with the help of the mongoose and the url of mongodb atlas we are connecting our application with the database.
we have stored the URL of the mongodb atlas in our env file to keep it secret because it is a good practice.*/

const connection = mongoose.connect(`${process.env.DATABASE_URL}`).then(() => { 

/*Using .then and .catch because this will return us a promise and we have to resolve it thats why
it is imporant use .then and .catch method.*/

    
    console.log("Connection Successfull");

}).catch(() => {

    console.log("Some Error Occurred");

})



module.exports = connection; //Exporting our connection to use it in our another file.


