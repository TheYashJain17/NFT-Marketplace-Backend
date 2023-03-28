const mongoose = require('mongoose'); //importing mongoose library to use it.

const crypto = require('crypto'); //importing the crpto package.

const bcrypt = require('bcryptjs'); //importing brypt module to use it.

const validator = require('validator'); //importing our validator module.

const userSchema = new mongoose.Schema({ //making new schema with the help of mongoose.

    Name : { //Defining the name of the field.

        type : String, //defining the type of name which is obvioulsly string.
        required : [true , "You Must Provide A Name"], //required true means user have to fill this field otherwise the user will get an error which we have provided inside the array.
        minlength : [3 , "Name Cannot Be Of Less Than 3 Characters"], //minimum length of the name must be 3 , otherwise the user will get an error which we have provided inside the array.
        maxlength : [20 , "Name Cannot Be Of More Than 20 Characters"],//maximum length of the name can be 20 only , otherwise the user will get an error which we have provided inside the array. 
        lowercase : true, //setting the lowercase to true so that if the user enter their name in multiple-case then all will be converted into lowercase.
        trim : true //trim true means if there is unnecessary space between the letters then it will gonna be removed automatically.

    },

    Email : {//Defining the name of the field.

        type : String, //defining the type of Email which is obvioulsly string.
        unique : [true , "You Must Enter A Unique Email"], //Email which is entered by the user should be unique , otherwise the user will get an error which we have provided inside the array. 
        required : [true , "You Must Provide An Email"], //required true means user have to fill this field otherwise the user will get an error which we have provided inside the array.
        select : false, //By writting this (select : false) this means we are hiding this field from the user , means if the select is false then the normal user will not be able to see the Email of any other person , only we can see the email in our database.
        validate(value){ //we are validating the email through which we gonna validate the value which the user is entering and inside it we are checking if the user has provided correct email or not

            if(!validator.isEmail(value)){ //we are checking the email which is provided by the user with the help of the vaidator and .isEmail which is the property of the validator and we are saying if the email provided by the user is not correct then throw an error to the user.

                throw new Error("You Must Enter A Valid Email"); //We are sending this error to the  user who is entering the wrong email.

            }
        }
    },

    Photo : { //Defining the name of the field.

        type : String, //defining the type of Photo which is obvioulsly string because we gonna store the URL of the image/photo which the user will gonna enter.

    },

    Role : { //Defining the name of the field.

        type : String, //defining the type of Role which is obviously string
        enum : { //declaring enum means the values we gonna define in this , only that should be accepted otherwise throw an error.

         values : ["user" , "creator" , "admin" , "guide"] //made an array and inside that defined the value which we were talking about above.

        }, 
        default : "user" //default value is set to the user if the user doesnt provide any role then it would be automatically assigned the user role.

    },

    Password : { //Defining the name of the field.

        type : String, //defining the type of Password which is obvioulsly string.
        required : [true , "You Must Provide A Password"], //required true means user have to fill this field otherwise the user will get an error which we have provided inside the array.
        minlength : [6 , "Password Must Be More than Of 6 Characters"], //minimum length of the password must be 6 , otherwise the user will get an error which we have provided inside the array.
        trim : true, //trim true means if there is unnecessary space between the letters then it will gonna be removed automatically.
        select : false  //By writting this (select : false) this means we are hiding this field from the user , means if the select is false then the normal user will not be able to see the Password of any other person , only we can see the Password in our database.

    },

    ConfirmPassword : {//Defining the name of the field.

        type : String, //defining the type of Password which is obvioulsly string.
        required : [true , "You Must Confirm The Password"], //required true means user have to fill this field otherwise the user will get an error which we have provided inside the array.
        minlength : [6 , "Password Must Be More than Of 6 Characters"],  //minimum length of the password must be 6 , otherwise the user will get an error which we have provided inside the array.
        trim : true, //trim true means if there is unnecessary space between the letters then it will gonna be removed automatically.
        validate : { //validating the password which the user is entering.

            validator : function(element){ //Using validator as key and function as value.

/*Here we are using normal function instead of arrow function because we want to use this keyword
and this keyword can be used only in normal function and not in arrow function.
And inside this function we are taking element as a parameter
(we can use any word instead of element which we want)
we are taking this parameter because the confirmed password which will gonna be enter by the user
will gonna come in this function.*/

                return element === this.Password; //with this line we are saying that the confirmPassword entered by the user should be exactly same as the password entered by the user otherwise show the error to the user.

            },

        message : "Password And ConfirmPassword Must Be Same", //this will gonna be shown as an error to the user.

        }

    },

    passwordResetToken : String, //Defining the name of the field and type which is the string.
    passwordResetExpiresIn : Date,  //Defining the name of the field and type which is the date.

    active : { //Defining the name of the field.

        type : Boolean, //defining the type of active which is obvioulsly boolean.
        default : true, //setting the default value to true means if the user doesnt mention anything then its value would be true by default.
        select : false //this means this field would not gonna be shown inside the database.

    }

    

})

/*Using pre hook of node js on our model 
(through which we are creating a new user and saving it details on our database )
And we are calling this pre hook just before saving the details of user in database , 
because we want to save hashed password of the user not the original(without hashed) password.*/

/*Using pre hook and inside it calling save method which is used in case of save or create somethiing
(user in our case).
then making async function which gonna be called through this pre hook means
just before saving the details.*/

/*We have used normal function and not the arrow function because we want to use this keyword
and when we are using arrow function we cannot use this keyword , therefore we have to use noraml function.*/

userSchema.pre("save" , async function(next){

/*With the below we are checking If the password is modified by the user , like if the user has updated
his/her password if this is the case then this function will not be called and process will move further
to next function with the next keyword a function.*/

    if(!this.isModified("Password")) return next();

//And if this is not the case(above case) then system will gonna perform the below code.

/*In the below line we are accessing the password of the current user(means the user who is registering
himself/herself) with the help of this.Password as it gives us the access of the input of the current user.

Then with the help of brycpt.hash we are hashing the password which the user is entering and also providing
the length of the process as 12 this is the best length because it is safe , seure and
also take less time to hash the password.*/

    this.Password = await bcrypt.hash(this.Password , 12);

/*we dont want to store the ConfirmPassword of the user into the database , we just want it to compare
that whether the Password and ConfirmPassword which the user is entering is same or not , 
else this has no use so with the below line we are saying to make the ConfirmPassword
which the current user is entering to undefined.
With this it will not gonna be store in the database.*/

    this.ConfirmPassword = undefined; 

/*Atlast Calling the next parameter as function so that the process wouldnt get stucked 
inside this function.*/

    next();

})

//Creating a function with the help of methods keyword of node js.

/*We are creating a function with name checkingCorrectPassword to check the password which the user is entering
and th password which is already saved inside the database in respect to the user.

This will gonna help in logging in of the user , therefore it will gonna be called when the user 
is logging in our website or any platform.*/

/*We are using our userSchema because we want to call in our user case,
and with the help of .methods we are making a new function and then after .methods we are
providing function name which is checkingCorrectPassword and inside it we are writing our logic.*/

/*Inside our function we are taking 2 parameters
1st is for the actual password which is present inside in our database in respect of the user.
2nd is for the password which the user is entering to logging in.*/

/*We are using this function in authenticationAllData.js to check correct Password.
Inside our exports.login.*/

userSchema.methods.checkingCorrectPassword = async function(actualPassword , userProvidingPassword){

/*And inside the function we are using bcrypt and its function which is .compare
to compare both the passwords 
(the password which is present inside the database and the password which the user is entering).

If both the passwords are same then the respective user can login into the site 
otherwise he will gonna face the error , to enter correct password.*/

    return await bcrypt.compare(actualPassword , userProvidingPassword)

//Thats how we are securing our login functionality and thats how only the authentic user can login.

};

/*Creating a function for the reset password token means with the help of this function we gonna generate
a token for resetting the password , using the userSchema we made and with the helps of .methods we are
creating a new function ,  providing the name which is createResetPasswordToken and inside
this we are providing a function*/

userSchema.methods.createResetPasswordToken = function(){

/*we are making a normal hash means not a complex one with the help of crypto package
and using .randomBytes method of crypto inside it providing 32 means create 
hash of randomBytes of 32 characters and convert it to the string with the help of 
.toString and inside it providing ("hex") to properly convert the hash into string.*/

    const resetPasswordToken = crypto.randomBytes(32).toString('hex');

/*We are generating the hash of the token which we want to send to the user through which the user cam reset
his/her Password , we are providing the token into hashed form because of the safety reasons if somehow
any other person gets the token then it will gonna comprise the security of the user therefore it is 
important to send the token to the user in the hash form.
we are hashing the token with the help of crypto package we imported and then using .createHash method 
of crypto and inside providing the algorithm through which we want to hash our token which is "sha256"
in this case and then with the help of .update we are updating the token which we have created above
and we are getting that token with the help of variable as we have stored that token in a variable
this will give us the token which the user is entering and 
then atlast we have written .digest which gives us the resulted hash value without .digest we will not
get our hash and inside that providing "hex" means we want our hash in the form of string otherwise we 
will get the hash in buffer form which is not useful for us.
And atlast we are storing this inside passwordResetToken of the user who is requesting for the reset of the
password we are accessing the respective user with the help of this keyword.
So whenever we want to hash something then perform the complete procedure which we hve performed below.*/

    this.passwordResetToken = crypto.createHash('sha256').update(resetPasswordToken).digest('hex');

//consolling both the tokens to see the difference as one is less hashed and another is properly hashed.

    console.log({resetPasswordToken} , this.passwordResetToken);

/*Then atlast setting the token expiry time which is 10 mins from the time user has requested to reset the
Password and we are converting that time into milliseconds and storing that into the respective User profile.*/

    this.passwordResetExpiresIn = Date.now() + 10 * 60 * 1000;

    return resetPasswordToken; //atlast returning the hashed token we generated.

}

/*This will gonna be called before the method we will define inside it as we are using .pre on userSchema
which means previously and inside it we are mentioning the save which means this will gonna run before the
user is getting saved into the database and inside this we are declaring the function means we want to run
this function before the user gets saved in the database.*/

userSchema.pre("save" , function(next){

/*Inside the function we are checking with the if condition that whether the respective user has 
modified/updated the Password , we are getting the respective user with the help of this and we are checking 
whether the password is modified with the help of .isModified and providing "Password" to check is the 
password is modiifed by the respective user or not and also inside the same if condiition we are are checking
is the user is a new user if thats the case then return next() means move to the next function.*/  

    if(!this.isModified("Password") || this.isNew) return next();

    next(); //calling the next parameter as function so that system wouldnt get stucked in the same function.


})
/*/^find/ works like pragma solidity ^0.8.9 which means it will contain 0.8.9 version and
also all the above versions of 0.8.9.

Similarly /^find/ works this contains .find() method and also all the methods which are related to .find()
like we are using .findById method in getSingleUser so this middleware will gonna work on it also.

means /^find/ is a method which contains all the methods which are related to .find().*/

/*This will gonna be called before the method we will define inside it as we are using .pre on userSchema
which means previously and inside it we are mentioning the /^find/ which means this will gonna run before the
user is getting found and inside this we are declaring the function means we want to run
this function before the user gets found.*/

userSchema.pre(/^find/ , function(next){

/*We are saying that find only those users whose active status is set to true means only those users will be
shown who has active value of true.

we are using this.find which will gives us the respective data and inside we are making an object and
inside that object we are saying active value should not be equal to false $ne means not equal to

so this will find the users whose active status is not equal to false means only active users will be shown.*/

    this.find({active : {$ne : false}})

    next(); //calling the next parameter as function so that system can move to next function and wouldnt get stucked inside this function.

})


const User = new mongoose.model('User' , userSchema); //Making our model with the help of mongoose and .model and inside it providing the database name and schema which we made above.


module.exports = User; //exporting the model.

// {

// "Name" : "Yash JAIN",
// "Email" : "Anything1234@gmail.com",
// "Password" : "pass1234",
// "ConfirmPassword" : "pass1234"

// }