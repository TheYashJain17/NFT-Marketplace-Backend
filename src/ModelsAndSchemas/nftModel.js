const mongoose = require('mongoose'); //requiring the mongoose package so that we can make model and schema.

const nftSchema = new mongoose.Schema({ //creating new schema with the help of mongoose.schema and using new keyword because we are creating new schema.

    /*We have entered so many fields which are not important , they are just for detailed information
    and not essential information it will just give us detailed analysis of our NFT.*/

    name : {

        type : String,
        required : [true, "A NFT Must Have A Name"], //have put this inside array because providing the condition and if the condition fails then the message  we have provided as string will gonna be shown.
        unique : [true, "The Name Of The NFT Must Be Unique"], //have put this inside array because providing the condition and if the condition fails then the message  we have provided as string will gonna be shown.
        trim : true,
        maxlength : [50, "NFT can be of 50 characters only"],
        minlength : [5, "Name must be atleast of 5 characters"],
        // validate : [validator.isAlpha , "Only Alphabets should be there in NFT Name"]

    },

    duration : {

        type : Number,
        required : [true , "Must Provide the Duration time"] //have put this inside array because providing the condition and if the condition fails then the message  we have provided as string will gonna be shown.

    },

    maxGroupSize : {

        type : Number,
        required : [true , "Must Have A  Group Size"] //have put this inside array because providing the condition and if the condition fails then the message  we have provided as string will gonna be shown.

    },

    difficulty : {

        type : String,
        required : [true , "Must Have A Difficulty"], //have put this inside array because providing the condition and if the condition fails then the message  we have provided as string will gonna be shown.
        enum : {
          values : ["easy" , "medium" , "difficult"],
          message : "Difficulty should be either : easy , medium or difficult"

        }
    },

    ratingsAverage : {

        type : Number,
        default : 4.5,
        min : [1, "Rating must be atleast of 1"],
        max : [5 , "Rating cannot be more than 5"]

    },

    ratingsQuantity : {

        type : Number,
        default : 0

    },

    price : {

        type : Number,
        required : [true , "A NFT Must Have A Price"] //have put this inside array because providing the condition and if the condition fails then the message  we have provided as string will gonna be shown.

    },

    priceDiscount : {

        type : Number,
        validate : {

            validator: function(val){
                return val < this.price 
            },
            message : "Discount price ({VALUE}) must be less than the original price of the NFT"

        }

    },

    summary : {

        type : String,
        trim : true,
        required : [true , "Must Provide A Summary"] //have put this inside array because providing the condition and if the condition fails then the message  we have provided as string will gonna be shown.

    },

    description : {

        type : String,
        trim : true

    },

    imageCover : {

        type : String,
        required : [true , "Must Provide An Image"] //have put this inside array because providing the condition and if the condition fails then the message  we have provided as string will gonna be shown.

    },

    images : [String],

    createdAt : {

        type : Date,
        default : Date.now(), //setting the default value of date as Date.now() so whenever the user will create a new NFT , date and time will gonna be added automatically of that particular date and time.
        select : false //By writing this we are saving this field in our database but the user will not be able to see this field. 
    },

    startDates : [Date],

    secretNfts:{ //This is the field which we were talking about in below middleware.

        type : Boolean, //this means it can contain only boolean value(true or false).
        default : false //we are setting the default value of this to false , so that we have to define especially whether the secretNfts is true or not otherwise it will automatically gonna set to false.

    }

},
{

//we are setting both on true so that it can work on both json and object.
    toJSON : {virtuals : true}, //For seeing this in our resulted NFTs, we have to add this property(this line).
    toObject : {virtuals : true}

})

                                //MONGOOSE MIDDLEWARE
                           
    //DOCUMENT MIDDLEWARE: runs before .save() or .create() method.

/*This is the middleware which we define inside our model , in this case it is doing nothing we are just
understanding its use.

we have called .pre method which means it would be called previously and before which method it would be called
depends upon the name of the method we are providing inside it.

Like here we have provided "save" which means this middleware will be called inside POST API means just
before the saving/creation of the NFT as we have used .create method inside our POST API
(.create or .save have same meaning thats why using "save " will als gonna work for us).

it is impotant to use next as function as it is a middleware.*/


nftSchema.pre("save" , function(next){ //All detailed information regarding this is available in above comments.

    console.log(this);
    next();

})


/*This is the middleware which we define inside our model , in this case it is doing nothing we are just
understanding its use.

we have called .post method which means it would be called after the method and after which method
it would be called depends upon the name of the method we are providing inside it.

Like here we have provided "save" which means this middleware will be called inside POST API means just
after the saving/creation of the NFT as we have used .create method inside our POST API
(.create or .save have same meaning thats why using "save " will als gonna work for us).

it is impotant to use next as function as it is a middleware.*/


nftSchema.post("save" , function(doc , next){ //All detailed information regarding this is available in above comments.

    console.log(doc); //this will give us the NFT which is created by the user with the help of this middlware.
    next();

})


    //QUERY MIDDLEWARE: runs before .find() method.

/*This is the middleware which we define inside our model , in this case it is doing nothing we are just
understanding its use.

we have called .pre method which means it would be called previously and before which method it would be called
depends upon the name of the method we are providing inside it.

Use of this middleware is , suppose we have some secret NFts which we dont want to show to our regular visitors
like those NFTs should only be seen by VIPs only.

So in this(above)case our this middleware like we can put authentication which we will do in further classes.

and for now we will put a condition in which we defined that if secret nft is true then it will not be seen by
anyone.

For this we have to define a new field in our model which is known as secretNfts(we have defined already).

/^find/ works like pragma solidity ^0.8.9 which means it will contain 0.8.9 version and
also all the above versions of 0.8.9.

Similarly /^find/ works this contains .find() method and also all the methods which are related to .find()
like we are using .findById method in getSingleNft so this middleware will gonna work on it also.*/


nftSchema.pre(/^find/ , function(next){ //All detailed information regarding this is available in above comments.

    this.find({secretNfts : {$ne : true}}); //this.find will give us the NFTs of the current model therefore we are using it.And inside it we are putting the condition that show only those NFTs whose secretNfts value will not be equal to true, means secretNfts containing value true will not gonna be shown in our resulted NFTs because of this middleware($ne is the method of mongo which means not equal to).
    
    next();


})


                            //AGGREGATION MIDDLEWARE

nftSchema.pre("aggregate" , function(next){

    this.pipeline.unshift({$match : {secretNfts : {$ne : true}}});

    next();


})



                            //VIRTUAL METHOD

/*Sometimes when we dont want to save some data into our database but want that information from the user
to calculate some data at the time when the request is done by the user
then the virtual method comes into light.

virtual method helps us to get that information of the user without letting us
to store that information on our database.

Inside .virtual we have to give a property of virtual method which is "durationweks" in this case.

And we have to add this field inside our model.*/

//We know that this data will not gonna be stored inside our model this will just gonna be shown inside resulted NFTs.

nftSchema.virtual("durationWeeks").get(function(){ //we have to take the normal function in this case not the arrow function because we have to use this property which will not gonna work inside arrow function.

    return this.duration / 7; //we are returning this.duration and dividing it with 7.

})

const NFT = new mongoose.model('NFT' , nftSchema); //Creating the model and providing the collection name in which we want to add the user data , if there is no collection exists with this name , a new collection will be made with the name we have given and there will be a 's' added in front of it.

module.exports = NFT; //exporting the model to use it in another file.
