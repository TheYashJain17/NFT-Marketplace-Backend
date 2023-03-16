//WE are making a function to handle our try catch block and we are exporting it hand to hand with the help of module.exports.

module.exports = myFn => { //taking a parameter to put a function inside  this function(as we gonna wrap all functions inside this function thats why taking a function as parameter).

    return(req , res , next) => { //returning (req , res , next) so that we can use these parameters with the function we gonna put inside this function.

        myFn(req , res , next).catch(next); //and inside our returning function we are just returning the function which we have entered as a parameter and also all the parameters and especifically we are targetting the .catch of that function so that we can target the error and catch we are providing the next because this is a middleware and when we enter next keyword then only it would be able to catch the error.


    }

}

//In simple words if you didnt understand anything in above code , so in that case just copy paste the above code if we want to use in another project.