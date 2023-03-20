const express = require('express');

require('dotenv').config();

const morgan = require('morgan');

process.on("uncaughtException" , err => { //using proces.on which is the inbuilt property of node and inside it using "uncaughtException" which is also a property of node , this will help us to treat the error we made by mistake suppose somehow we have entered something which is not defined in our code or we have written something by mistake , then this will gonna save us , with this we are treating this error.

    console.log(`UncaughtException Shutting Down Application`); //consolling this statement

    console.log(err); //consolling the error we are getting.

    process.exit(1);  //using process.exit(1) this statement crashes our app and our app will stop working.
   
})

const golbalErrorHandler = require('../Controllers/errorHandlingAllData'); //importing our globalErrorHandler.


require('../ConnectionFile/connectionWithMongo');

const nftRouter = require('../src/Routes/nftsRoutes');

const app = express();

app.use(express.json());

app.use(morgan('dev'));

app.use(golbalErrorHandler);

app.use(nftRouter);

const port = process.env.PORT;


app.all('*' , (req , res , next) => {  //using app.all which gets apply on all  router and using "*" which means on every route.

    next(new errorHandling(`Can't Find ${req.originalUrl} On This Server`)); //inside next we are sending the error with the help of the class we made and using req.originalUrl which gives us the URL/API which the user is trying to access.

})

process.on("unhandledRejection" , (err) => { //using proces.on which is the inbuilt property of node and inside it using "unhandledRejection" which is also a property of node , this will help us to treat the internal error suppose somehow we have loose connection with our database , then this will gonna save us , with this we are treating this error.

    console.log(err.name , err.message); //consolling the name of the error and message of that error.

    console.log('UnhandelRejection Shutting Down Application'); //consolling this statement.

    process.exit(1); //using process.exit(1) this statement crashes our app and our app will stop working.


});



app.listen(port , () => {

    console.log(`Server is running on port ${port}`);


})