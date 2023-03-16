//We are making a class to handle our errors just using javascript class nothing rocket science.

class errorHandling extends Error{ //This line means we are making a new class  errorHandling and inheriting this class from Error means this class will gonna inherit all the properties of parent class(Error class - this is a predefined class like we use this when we have to defined a new Error then this class helps us , this is a predefined class in javascript).

    constructor(message , statusCode){ //Constructor gets called automatically when the class is used.Initialised a constructor inside our class and inside constructor we are taking 2 parameters , 1st is message which we want to show to the user and 2md is the statusCode which the user will see like 404 or anything. 

        super(message); //using  super keyword to access the message of  parent class and message will gonna be receive from the parent class(Means from the predefined Error class of javascript).


        this.statusCode = statusCode; //using this means the current statusCode of that code in which we are using this class.With this we are targetting the current code.Thats how it will be dynamic.
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error"; //this.status means the current status of that code inside which we are using this class.we are using .startwith property of javascript and ternary operator, with .startswith property we are checking that what is the statusCode of the code like whether the code is 404(error) or 500(internal error) as we have set these 2 errors so with .startswith property we are checking whether the first letter of the status code is starting with 4 or 5 , if it is starting with 4 then it means it is 404 then with the help of ternary ternary operator we will show our user the status "Fail" or if the statusCode is starting with 5 means 500 then our user will get to see "Error" status , thats how we are using both the properties to show the status to the user according to the statusCode.    
        this.isOperational = true; //We are checking with isOperational that if the user is making any error , if that so then show that error also.

        Error.captureStackTrace(this , this.constructor) // with the help of this we are seeing that where the error exactly happening.

    }
}

module.exports = errorHandling; //then exporting this class to use in another file.