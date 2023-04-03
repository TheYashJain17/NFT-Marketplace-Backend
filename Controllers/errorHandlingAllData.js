//In this file we are making functions to handle our all kind of errors.

const errorHandling = require("../utils/errorHandling");//importing the class we made inside another file.

/*Generally when we made a middleware it consist of three parameters only but when we are handling the errors
we have to provide parameters whihc includes err as a parameter also.
Therefore we hae taken 4 parameters.*/ 

module.exports = (err , req , res , next) =>  {

// This the function we are using below and defining here.

const handleJWTExpiredError = () => { //Inititalsing function

    return new errorHandling("Your Token Got Expired  , Please Log In Again" , 401); //then we are using our class(errorHandling) which we made in another file , we are returning the error with the help of the this function and the class we made and inside our class we are sending the failed statement and also defining the statusCode which is to be send with the error.

}

const handleJWTError = (err) => { //Inititalsing function with the err as parameter to catch the error.

    const message = `${err.name} : Invalid Token , Please Log In Again`; //We are making a message to send to the user, we are using template literal

    return new errorHandling(message , 401); //then we are using our class(errorHandling) which we made in another file , we are returning the error with the help of the this function and the class we made and inside our class we are sending the message we created just above and also defining the statusCode which is to be send with the error.

}

// This the function we are using below and defining here.

    const handleCastError = (err) => { //Inititalsing function with the err as parameter to catch the error.

        const message = `Invalid ${err.path} : ${err.value}`; //We are making a message to send to the user, we are using template literal and then we are showing the place of the error and the value of the erorr because of which the error is occurring.

        return new errorHandling(message , 400); //then we are using our class(errorHandling) which we made in another file , we are returning the error with the help of the this function and the class we made and inside our class we are sending the message we created just above and also defining the statusCode which is to be send with the error.

    }

// This the function we are using below and defining here.


    const handleDuplicateFieldError = (err) => { //Inititalsing function with the err as parameter to catch the error.

        const value = err.errmsg.match(/(?<=")(?:\\.|[^"\\])*(?=")/); //we are checking accessing the errmsg which is present inside the error and on that we are applying the .match property of javascript and inside that we are providing the regular expressions match between quotes(search regular expressions match between quotes and click on the stack overflow and inside that copy the the value we have provided inside match property)this expression will help us to find the exact match.Always rember to put this expression between // between these two slash enter that expression and alltogether put this inside match property.

        console.log(value); //we are consolling the result we got after using match property.

        const message = 'Duplicate Field Values . Please Use Another Value' //Creating the msg which we gonna send to the user.

        return new errorHandling(message , 400) //Then with the help of our class we are creating new error and inside it entering the message we have defined above and also providing the statusCode which is 400 which the user will gonna see.

    }


// This the function we are using below and defining here.


    const handleValidationError = (err) => { //Inititalsing function with the err as parameter to catch the error.

        const errors = Object.values(err.errors).map(el => el.message); // we are taking a variable name errors and inside that we are using object property of javascript and with the help of object.values we are getting all the which are present inside that object as there could be multiple errors in case of validation and inside we are takiing all the errors we are getting and on that we are using map property of javascript and we are creating new a array inside that we are providing all the messages which generated while the error occurred, this will give us the array of the messages according to the error we are getting.
        const message = `Invalid Input Data. ${errors.join(". ")}`; //Then we are creating the message which we want to show to the user and inside that applying .join property (. ) means put a dot and a space between 2 or more messages.

        return new errorHandling(message , 400); //then sending a new error with the help of the class we made and inside that we are providing the message we created and the statusCode.
    }

    // console.log(err.stack);

    err.statusCode = err.statusCode || 500; //We are getting access of err because we have defined err as parameter inside our function and if there would be any error then our function will catch it and we gonna have the access of err , we are setting the err.statusCode value , we are saying if there is already err.statusCode value present there , then use it othwerwise use 500 as err.statusCode.

    err.status = err.status || "Error Occured"; //We are getting access of err because we have defined err as parameter inside our function and if there would be any error then our function will catch it and we gonna have the access of err , we are setting the err.status value , we are saying if there is already err.status value present there , then use it othwerwise use "Error Occured" as err.status.


/*In response we are sending the json with the err.statusCode we defined above.
And in response we are sending multiple things.*/

        res.status(err.statusCode).json({ //sending response in json

            status : err.status, //as status we are sending the  status we defined above.
            message : err.message, //Sending message we are getting the err to the user.(For ex if the error is coming because of the NFt model we have set then inside our model , the errors we have defined on different places thats gonna show , if we woulnt have written the name then we will get the message that you must porvide a NFT name , this is how its work).
            error : err, //Sending the whole error to the user (if we dont want to show this to the user then we can remove this also).
            stack : err.stack //With this we are sending the place where the error is occurring.
    
        })


    let error = {...err}; //we are destructing the errors we are getting.

    if(error.name === "CastError") error = handleCastError(error);//We are checking if the name of the error is === CastError then run handleCastError function with the error parameter and we have defined this function above.
    if(error.code === 11000) error = handleDuplicateFieldError(error);//We are checking if the code(means number like 11000) of the error is === 11000 then run handleDuplicateFieldError function with the error parameter and we have defined this function above.
    if(error.name === "ValidationError") error = handleValidationError(error);//We are checking if the name of the error is === ValidationError then run handleValidationError function with the error parameter and we have defined this function above.
    if(error.name === "JsonWebTokenError") error = handleJWTError(error); //We are checking if the name of the error is === JsonWebTokenError then run handleJWTError function with the error parameter and we have defined this function above.
    if(error.name === "TokenExpiredError") error = handleJWTExpiredError(); //We are checking if the name of the error is === TokenExpiredError then run handleJWTExpiredError function and we have defined this function above.

    next(); //At the end using next parameter as a function because this is a middleware and we have to use this.

}

