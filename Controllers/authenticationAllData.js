const {promisify} = require('util');  //Imporing inbuilt module of javscript from util , this helps us in resolving promises.

const crypto = require('crypto'); //Importing crypto module.
 
const User = require('../src/ModelsAndSchemas/userModel'); //Importing our user model from another file.

const jwt = require('jsonwebtoken'); //importing jsonwebtoken which gonna helps us in generating token.

const errorHandling = require('../utils/errorHandling'); //importing our errorhandling class from another file.

require('dotenv').config(); //initialising this function so that we can see the data of our .env file.

const handleAsync = require('../utils/handleAsync'); //importing handleAsync function from another file.

// const sendEmail = require('../utils/email'); //Importing the file from another file we made.

const generatingToken = (id) => { //making a function to generate the token , making this in separate function so that we can use it in different places and we dont have to write the same code again and again.And taking id as parameter because we will gonna generate the token on the basis of id of the user.

    return jwt.sign({id} , process.env.SECRET_KEY , { // using our jsonwebtoken which we imported as jwt and using .sign method of jsonwebtoken and inside it providing the id which we are taking as parameter this will create the token with the help of the id of the user and 2nd thing we are providing is a secret key which we have defined inside our .env file where we kept our all secrets. A secret key can be anything , we can make our secret key buy ourself there is nothing rocket science in it(look in .env file for better understanding the secret key).

        expiresIn : process.env.TOKEN_EXPIRES_IN // and with the generation of token we are also specifying the time under which the token will be expired(remember to keep this inside an object) , this is also specified inside our env file for better privacy.
    
})
}

/*making a new function for sending token , we are making a common function so that can use in mulitple places.
Inisde that providing 4 parameters 1st is message which the user is going to see , 2nd is the user which is
accessing this function , 3rd is the statusCode means which statusCode we want to send and 4th is res
this is going to be our response which the user is going to see.*/

const createSendToken = (message , user , statusCode , res) => {

    const signUpToken = generatingToken(user.id) //user is the variable in which we are storing the data of the user accessing this function  and with .id we are targetting his mongo id. And after getting the id this function will gonna generate a token for the respective user and then storing the token of the user in the variable.

    
/*In the below line of code we are defining the cookie options which we gonna send with the cookie we are
generating and these options are important as we gonna target our sended cookie.*/ 

    const cookieOptions = { //we are making an object which we gonna send with our cookie.
        
/*In below line we are setting the expiry time of the cookie , like we want our cookie to get expired in
as we dont want to keep the user logged in for always or a very long time.
So below we are setting the expiry time with the expires property of mongo , we are saying that from
the date or time user is generating and then from that time or date we are adding 7 days of time
means after 7 days after the user generated the cookie expire the cookie and we have stored 
expiry time of cookie in env file and we have written * 24 * 60 * 60 * 1000 to convert the time into 
milliseconds.*/


        expires : new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN ),

/*With the secure property of mongo and doing it true we are saying that send cookie only on a secured network
it means no cookie means user cannot access our website , right now we are commenting this out because 
we are in development and we are not on the secure network.*/

        // secure : true,

/*With the httpOnly which is mongo property and doing it true means cookie will be generated only on the 
connection which contains http.*/ 

        httpOnly : true


    }

/*With the below line we are saying if we are production environment then set the secure of the cookie to true.
Means as we were in development we were having the insecure network but when we will be in production , we can
set it to true because then we will have a secure network.*/

    // if(process.env.NODE_ENV = "production") cookieOptions.secure = true;

/*With the below line of code we are sending the cookie to the user  with the help of res.cookie
and inside we are setting the type of token we are generating which is jwt , therefore we have written "jwt"
and then we are providing the token we are generating above inside createSendToken  and then we are providing
the cookieOptions we generated above.
With all of this we are sending our cookie this is a complete cookie with all the things.*/

    res.cookie("jwt" , signUpToken , cookieOptions)

/*With the below line of code we can hide the field we want to , like if dont want to show the password 
to the newUser then we can simply do this with below line and so on we can hide any field we want to.*/


    // newUser.Password = undefined;

    res.status(statusCode).json({ //sending response in json form.


        status : "Success", //setting the status to success
        Token : signUpToken, //This the token which is generated when the user sign up or logged in. 
        data: {

            // user : newUser
            message : message //inside data we are sending this success message


        }

    })


}

/*We are making a separate route for the regsitration/signup of the user like with this route user can
register herself/himself on our website or any other platform */

/*We have made this route with name signup and inside it we are using our handleAsync function to handle
our errors and inside we are taking 3 parameters req , res and next because this will gonna
act as a middleware as user wouldnt be able to reach to the main page without login/signup ,
therefore if the user is new then it is important for the user to signup*/

exports.signup = handleAsync(async(req , res , next) => { 

    const newUser = await User.create({ //creating a new user with the help of our userModel and .create method of mongo , now inside we are taking details of the user so that we can store them on or database. 

//Always remember to use this method to save user details instead of (req.body) otherwise user can become of our API or Database.
        
/* On Left-Side we have our keys , these are the fields which are present inside our model , 
Be carefull while writing the names of these fields as they are case sensitive.

On Right-Side we have our values which we are getting from the user and
with the help of req.body.(FieldName) we are targetting at the exact field in which
the user is entering his/her data , remeberer these fieldsNames are also case sensitive.*/


        Name : req.body.Name,
        Email : req.body.Email,
        Photo : req.body.Photo,
        Role : req.body.Role,
        Password : req.body.Password,
        ConfirmPassword : req.body.ConfirmPassword

    });


    // createSendToken("New User Has Been Created Successfully" , 201 , res);

/*After all the details get entered by the user a token will be generated on the basis of his/her id
This id is the id which is provided by the mongo so that id will help in generating the token.
And the user will gonna be saved on our database.*/

const signUpToken = generatingToken(newUser._id) //newUser is the variable in which we are storing the data of the our new user and with ._id we are targetting his mongo id. And after getting the id thid function will gonna generate a token for us.

    res.status(200).json({ //sending response in json form.


        status : "Success", //setting the status to success
        Token : signUpToken,
        data: {

            // user : newUser
            message : "New User Has Been Created Successfully" //inside data we are sending this success message


        }

    })

    console.log(newUser); //consolling the details of the newUser to see user details.


})



/*We are making a separate route for the login of the user means
with the help of this route user can login to our website or any platform 
for which we are making this API like with this route user can register herself/himself
on our website or any other platform.*/

/*We have made this route with name login and inside it we are using our handleAsync function to handle
our errors and inside we are taking 3 parameters req , res and next because this will gonna
act as a middleware as user wouldnt be able to reach to the main page without login/signup ,
therefore if the user is old then it is important for the user to login.*/

exports.login = handleAsync(async(req , res , next) => {

    const {Email , Password} = req.body; //with the help of destructuring we are getting the Email and Password of the user which he/she is entering in form of req.body , we are getting the user Email and user Password.

    if(!Email || !Password){ //We are checking if the user has not enetered Email or Password , as both are compulsory for the login of the user , so if the user is not entering his/her Email or Password.

       return next(new errorHandling("Please Provide Your Email And Password")) //Then we are throwing the error to the user with the help of errorHandling class.And We are providing this error inside next so that function shouldnt remain stucked.

    }
    

//In the below line we are searching for the user when he tried to login by entering his/her Email and password

/*We are finding the user in our database with the help of the findOne and the Email which the user
is entering and checking whether there is any same Email present inside our database
which the user is entering and with the help of user Email and select property we are searching of 
the Password of the same user , we have to do this because we have used select property inside our model
to hide the password , 
therefore use the exact line we have entered to get the password.*/

    const loggedInUser = await User.findOne({Email : Email}).select("+Password");

    // console.log(loggedInUser);

/*with the below line we are checking if there is no user with the Email he/she has entered
Or if the user has entered the wrong Password(we are checking the password with the help of the function
we made inside our userModel file) then throw the error.*/

//Importing checkingCorrectPassword from userModel as we made this function inside our userModel.js.

    if(!loggedInUser || !(await loggedInUser.checkingCorrectPassword(Password , loggedInUser.Password))){

        return next(new errorHandling("Incorrect Email Or Password" , 401)); //throwing error with the help of the errorHandling class we mad and also sending the statusCode.

    }

/*With the below line we are using the function we made above which gonna send the token , messgage , statusCode
and the response , but here we have commented out because we are sending the normal response.*/

    // createSendToken("You Have LoggedIn Successfully" , 201 , res);


/*And if everything is okay, means user is a exsisting user(we found the user Email in our database) and
the user is entering the correct password 
then the user will be logged in successfully and below line will be executed.*/

/*With the below line we are generating a new token for the logged in user and we are generating this
token with the help of the id of the user.*/

    const logIntoken = generatingToken(loggedInUser.id);

    res.status(200).json({ //sending the response in the form of json.

        status : "Success", //setting the status to success.
        token : logIntoken,
        message : "You Have LoggedIn Successfully" //sending the success message to the user.
 
    })

    console.log(logIntoken);//consolling the token of the logged in user. 


})

/* We are making a new function with name protectData , we are making this is an async funciton and inside
it providing three parameters req , res , next.

With this function we are checking if there is token present or not , this means we are saying protect our data
from the unknown person means if the user is not signed up or logged in then dont show our data to the user.
We can use this on any API we want , just have to use this function inside the route just before the data
we are rendering , just put this function and it will gonna work for us on that API.*/  

exports.protectData = async (req , res , next) => {

//We have declared an empty vriable.

    let validationToken

/*In the below line we are checking with if condition that
whether the req.headers.authorization or
req.headers.authorization name startsWith "Bearer" or not 
if there is req.headers.authorization and  it starts with Bearer then only move to next line.*/


    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){


/*Then using .split method of javascript and providing a space between the Bearer and the token we got there
and accessing the 2nd value of that place as we are using index value so that [1] will give us the 2nd value.
this is how we will get the token we generated and we are storing the token into the empty
variable validationToken we declared above.*/ 
    
        validationToken = req.headers.authorization.split(" ")[1];

        // console.log(validationToken);

    }


    if(!validationToken){ //If there is no validation token 


        console.log("You are not a logged in user") //consol this statement.

        return next(new errorHandling("You are not the logged in user , Log in to get access " , 401)); //sending this error in resposne with the statusCode.

    }

/*With the below line of code we are validating the token we are getting that whether is token is genuine or not
as user can send aynthing as token and enter into our site.

therefore we are using verify property of jwt which we installed 
and we are using promisfy because this will gonna give us a promise and we have to resolve and we are resolving
it with the promisify and inside the verify method we have to provide the token we are getting after 
the log in or sign up of the user and then 2nd parameter is our secret key which we have defined 
inside our .env file , with this system will gonna verify the token by its own and we dont hvae to do anything
regarding this.
Just remberer to use the brackets in same way as we have done here otherwise we will get an error.*/


    const validation = await promisify(jwt.verify)(validationToken , process.env.SECRET_KEY);

    // console.log(validation);


    next(); //calling the next parameter as function otherwise we will gonna stucked inside the same funciton.

}

/*We are making this function to restrict normal user from deleting the NFTs as only guide and admin can 
delete the NFTs else no one can.*/

/*In this we are getting the role of the user which is present inside their profile as we have defined another
field inside our model to store the user role and and with the help of spread operator(...) 
we are destructuring the role of the user as we are getting roles of all the users and we have to get 
the respective role of the respective user thats why using destructuring.*/

exports.restrictTo = (...roles) => { 

//returning a function with three parameters req , res , next.

    return(req , res , next) => {

/*And now inside this function we are checking with if condition that whether the parameter we provided did
it includes(with the help of .includes property of javascript) the user which is requesting to access this
function(means in the API we are putting this function) and we are targetting the role of the user
which is requesting to access this function and if there is no role present regarding the user
then this condition will stop the user from moving ahead as we have to provide the role
thats how restricting the normal user from deleting the NFTs.*/

/*Inside our NFTsRoutes we are using this function inside delete NFT API and we are providing
guide and admin as parameter which gonna be treated as roles and function will gonna work for
the guide and admin only.*/

        if(!roles.includes(req.loggedInUser.Role)){

//If the user is normal or not providing any role then the  user will receive an error

            return next(new errorHandling("You Dont Have the Access to delete the NFT" , 403)) //returning this error in next function so that function wouldnt get stucked.

        }

        next(); //calling next parameter as funciton so that can move to next function.

    }

}






