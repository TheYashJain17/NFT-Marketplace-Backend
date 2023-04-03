/* In this file we are putting all the data of our apis, this means this is the data which was present inside
our APIs routes , we put that all data in a function and export that function using exports, 
we are exporting all the functions separately using (exports.) and after that the function name , we are 
exporting seaprately so that we can use all the functions seaprately.*/
//IMPORTANT NOTE- Kindly use dollar sign($) where we have used it otherwise we will get an Error.

                                    //IMPORTANT NOTE

/*In this file we have commented out all the try catch block and instead of that we have made handleasync
and used it in place of try catch block as our handleasync function is handling our error.
we have covered all the code in handleaync function just as simple as this and after this we dont have to use
try catch and dont have to provide and code for error , our handleasync will handle all errors.*/

const NFT = require('../src/ModelsAndSchemas/nftModel'); //requiring our model to use it

const APIFeatures = require('../utils/apiFeatures'); //requiring the class which we made inside separate file

const handleAsync = require("../utils/handleAsync");

const errorHandling = require('../utils/errorHandling');

                                //TOP 3 NFTS API

            //Making this API so that with the help of this we can get top 3 nfts.

exports.aliasTopNFTs = (req , res , next) => { //this will gonna act like a middleware thats why we have put the next as parameter and we are exporting this hand to hand with the help of exports so that we can use this in another file.


    req.query.limit = "3"; //we are setting the limit to 3 so that only 3 nfts will gonna be shown

    req.query.sort = "-ratingsAverage,price"; //we are sorting this om the basis of ratingsAverage and price which are already present inside our database in the NFT we created. 

    req.query.fields = "name,price,ratingsAverage,difficulty"; //Top 3 NFTs will only gonna be decided on the basis of these fields only.

    next(); //calling the next parameter as function is important otherwise our function will be stucked.

}


                                //GET API

    //(Making the GET API with the router so that we can export the apis in another file)

exports.getAllNfts = handleAsync(async(req , res , next) => {

    const features = new APIFeatures(NFT.find() , req.query).filter().sort().limitFields().pagination(); //using all the functions which we created inside class and especially on GET API so the user can get the NFTs according to the filters and limits we have provided , thats the way of using a class function , if we dont want to use any class function just simply remove it.

    const nfts = await features.query;

    res.status(200).json({ //sending response in the form of json

        status : "Success", //setting the status to success
        totalNfts : nfts.length, //sending the total length of the nfts array as totalNfts to show the user how many nfts have been made till now.
        data : {

            allNfts : nfts //In data, we are sending all the nfts which we found and stored inside nfts variable.

        }})
    
    console.log("All NFTs has been found successfully"); //Consolling The Success Statement in our console.


})


                                    //GET API
        
                    //making the GET API to get the single NFT

// router.get('/api/v1/nfts/:id/:id2/:id3?' , async(req , res) => { // This is for the purpose when we want to have multiple ids.Question mark means it is optional to proivde id otherwise it is mandatory to provide id else we will get an error.
exports.getSingleNft = handleAsync(async(req , res , next) => {

    const _id = req.params.id; //getting the id which the user has entered as we have made the route in that way in which the user can enter a id. We are getting the id with the  help of req.params.id and storing it inside _id variable because in mongo db the id is always get stored inside _id therefore always remember to use _id while getting the id from the user.

    const singleNft = await NFT.findById(_id); //with the help of our model and .findById , we are entering the id which the user entered and on the basis of that id we are searching for that particular NFT.

    if(!singleNft){
        return next(new errorHandling(`No NFT Has Been Found With Id ${_id}` , 404));
    }

    res.status(200).json({ //sending resposne in json form.

        status : "Success", //sending the status to success
        nftFound : 1 , //for now we are hard quotting the value 1 because with one id user can find only one NFT.
        data : {

            yourRequestedNFT : singleNft //In data , we are sending in the requested NFt the NFT which the user requested for as we have stored it inside singleNft Variable.

        }})
    
        console.log(`NFT of id ${_id} has been found successfully`); //consolling the id which the user is entering.


})


                                //POST API

//With this API the NFT which the user will create will gonna be saved inside database.


exports.makeNewNft = handleAsync((async(req , res , next) => {

    const newNFT = await NFT.create(req.body); //using our model(NFT) and .create method to create the data and we are going to take the user data therefore we are using req.body to get all the data from the user and entering it inside .create so that data will gonne be entered into the database which the user is entering.

    res.status(201).json({ //sending the response in json format.

        status : "Success", //setting the status to Success
        data : {

            nft : newNFT //And in form of data we are sending the nft which the user has created by himself/herself.
        }})
    
        console.log("Your NFT Has Been Created Successfully"); //consolling the success statement.

}));


                                    //Patch API
        
//Making a Patch API to update its NFT(Means the NFT created by the user he/she can update it) , whatever the user want to update and he/she doesnt have to update whole data.                            



exports.updateNft = handleAsync(async(req , res , next) => {

    const _id = req.params.id; //getting the id which the user is entering , we want that id because then only we would be able to know what is that particular data what the user wants to update.

    const updatedNFT = await NFT.findByIdAndUpdate(_id , req.body , { //using our model(NFT) and .findByIdAndUpdate to update the data we are entering the id that means providing the id of the data we want to update and then providing req.body this will give us the data which the user is entering so that we will get the updated data and that will be replaced by the data which is already there in that particular data.

        new : true, //setting new as true so that the user can see the updated data otherwise even after updating the data user will gonna see the non updated data.
        runValidators : true //setting runValidators to true so that the validators we defined in our schema and models can work here like no duplicate name or any other thing we defined inside models and schemas.

    });

    if(!updatedNFT){
        return next(new errorHandling(`No NFT Has Been Found With Id ${_id}` , 404));
    }

    res.status(200).json({ //sending response in json format.

        status : "Success", //seeting the status to success.
        updated : "Success", //setting the updated to success , with this we are showing that the data has been updated successfully.
        data : {

            result : updatedNFT //Inside data as a result we are sending the updated data to the user. so that he/she can see that his/her data has been updated successfully.

        }})
    
        console.log("NFT Has Been Updated Successfully");//consolling the success statement.


})

                                //Delete API

        //With this API user can delete the NFT which is created by the user itself.


exports.deleteNft = handleAsync(async(req ,res , next) => {

    const _id = req.params.id; //getting the id which the user is entering with the help of req.params.id

    const deletedNFT = await NFT.findByIdAndDelete(_id);//using our model(NFT) and .findByIdAndDelete to delete the NFT which the user has created and with the help of the id which the user is entering we can know what NFT has to be deleted.
  
    if(!deletedNFT){
        return next(new errorHandling(`No NFT Has Been Found With Id ${_id}` , 404));
    }

    res.status(204).json({//sending response in json format.
  
      status : "Success", //setting the status to success
      data : deletedNFT //and in response user will get nothing as we have deleted a NFT therefore there is nothing to show. 
  
    })

    console.log("NFT Has Been Deleted Successfully"); //consolling the success statement.


})




                                //AGGREGATE PIPELINE 
                        
// Refer Mongoose documentation for more information/Detailed information about AGGREGATE PIPELINE

/*This becomes really helpful when we have some data and we want to do some calculation on it.

Like Suppose we want to find the average of all the NFTs or average price of all the NFTs and more than this.

In these type of cases AGGREGATE PIPELINE comes into light which is provided by mongoose.

We are making separate route for this , therefore following the same structure as we were following 
for the rest of the routes.*/

// try{
exports.getNFTsStats = handleAsync(async(req , res) => {

/*we are using our model(NFT) which we imported and using .aggregate method which is provided by the mongoose.
(You can go to mongoose documentation to know more about this method).and inside .aggregate method
we are defining an array and inside we have to all the syntax in the form of object like we have done here.
And we are storing all this inside a variable name stats that will gonna return all our data which we defined 
inside our .aggregate method and that we will gonna send in form of resposne when the user will gonna 
request us for the data.*/

        const stats = await NFT.aggregate([ 
        {

/*using $match property of mongoose which helps us to match data in our database suppose we want to match data
on the basis of price or likes means only that data will gonna be shown which will match with the field we have
provided like here(in below line) ratingsAverage and inside it we have used $gte property of mongoose or mongo
which means greater than and we are defining inside it that $gte : 4.5.

Intotal it means match with only those results(NFTs) which have ratingsAverage greater than or equal to 4.5.

Below line is doing this for use.*/

            $match : {ratingsAverage : {$gte : 4.5}} //This is a nested object as there is object inside object and another object inside that object.

        },

        {

/*Now we will group the data with the help of $group property which is provided by the mongoose or mongo.
This will let us send the data to the user in the form of group.

Like In this project , All NFTs have different type of difficulties like easy , medium and difficult. 
So we gonna make group of data on the basis of their difficulty , if we want we can make group on the basis
of ratingsAverage but here we gonna make it on the basis of difficulty.*/



            $group : {

/*Inside _id we are providing $difficulty which means grouping will be done on the basis of difficulty.
As there are 3 types of difficulties present inside our database means our NFTs's difficulties are of 3 types
easy , medium and difficult so as we povide $difficulty inside our _id our data will be grouped on the basis
of the difficulty and as response we will get 3 types of data which will be divided on the basis of difficulty
and remaining all the data will be changed according to the grouping.

Like for ex if there are 4 NFTs with easy difficulty so we will get those 4 NFTs in our result
in easy difficulty group and all the remaining data will gonna be effected with this.

Like there are minPrice and maxPrice property in our aggregate method which were giving minPrice and maxPrice
according all the data present in our database means all NFTs but in this case minPrice and maxPrice 
will be calculated only on those 4 NFTs means all the data will be effected by the grouping all the fields
will be effected and result will be shown on the basis of the NFTs
present inside their group(easy , medium and difficult) and not on the basis of entire data present inside
database.

we could provide anything inside _id and on that basis group will be created thats why we have created another
group on the basis of ratingsAverage but here we only gonna keep group on the basis of difficulty thats why
we have commented out ratingsAverage.*/


                _id : "$difficulty", 

                // _id : "$ratingsAverage",

                numNFT : {$sum : 1}, //If we want to know that how many NFTs(or any data) we have in our database then use $sum and provide 1 inside it that will give us the length of all the NFTs means total NFTs present in our database. 
                
                avgRating : {$avg : "$ratingsAverage"}, //In avgRating field we are providing avg of all the ratings of NFTs present in our database , we are using $avg method of mongoose or mongo to calculate the avg and then we have to provide the exact field name with dollar sign($) as we have written then only this method will gonna work properly.This will give us average of all the ratings and we will display it in avgRating field.

                avgPrice : {$avg : "$price"}, //In avgPrice field we are providing avg of all the Prices of NFTs present in our database , we are using $avg method of mongoose or mongo to calculate the avg and then we have to provide the exact field name with dollar sign($) as we have written then only this method will gonna work properly.This will give us average of all the Prices and we will display it in avgPrice field.

                minPrice : {$min : "$price"},//In minPrice field we are providing min price which exist in all of the NFTs like the NFT which has the minimun price among all the NFTs that price will gonna be shown here , we are using $min method of mongoose or mongo to get the minimum price and then we have to provide the exact field name with dollar sign($) as we have written then only this method will gonna work properly.This will give us minimum price from all the prices as we are providing the price field , thats why we will get the minimum price if we would have given averageRatings then we would have get minimum rating from all the NFTs thats how this method works and we will display it in minPrice field. 

                maxPrice : {$max : "$price"} //In maxPrice field we are providing max price which exist in all of the NFTs like the NFT which has the maximum price among all the NFTs that price will gonna be shown here , we are using $max method of mongoose or mongo to get the maximum price and then we have to provide the exact field name with dollar sign($) as we have written then only this method will gonna work properly.This will give us maximum price from all the prices as we are providing the price field , thats why we will get the maximum price if we would have given averageRatings then we would have get maximum rating from all the NFTs thats how this method works and we will display it in maxPrice field. 

            }

        }

    ])

    res.status(200).json({ //sending the response in json form.

        status : "Success", //setting the status to success.
        data : { //and inside data we are sending all the data we calculated and stored inside stats variable

            stats //thats why sending  stats as response.

        }

    })
   
})


                                //MONTHLY PLAN API

        //CALCULATING NUMBER OF NFT CREATED IN THE MONTH OR MONTHLY PLAN.

/*This API will help us in knowing that how much NFTs has been created in a partiucular month or a year.
For this we also gonna create a separate route therefore we are making a function and exporting it.*/


exports.getMonthlyPlan = handleAsync(async(req , res , next) => {


    // try {

        const year = req.params.year * 1; //getting the year from the user in the form of params so that we can show according to the year what NFts have been made in that month of that particular year what the user has asked for.

        const plan = await NFT.aggregate([ //gonna use aggregate method of mongoose or mongo which we used above to create the aggregate pipeline.And inside provided an array and now inside that array we gonna provide objects which gonna help us to get the desired results.


            {

/*$unwind property of mongoose or mongo helps us to unwind the data as we know what the unwind means
here we are unwinding data of startDates as we have multiple start dates of a NFT(3 dates) this will separate
all the dates.*/

                $unwind : "$startDates" 

            },

            {

/*Then we are using $match property of mongoose or mongo like we used above and we will use it to match
the startDates of the NFTs with the year which the user has entered and then show the result(NFTs).
Only those NFTs will be shown whose separate startDates will gonna match with the year entered by the user.*/

                $match : { 

                    startDates : { //we are providing the data inside startDates field

                        $gte : new Date(`${year}-01-01`), //using $gte (greater than or equal) property of mongoose or mongo and inside $gte providing new date and inside new date we are inserting the year which is entered by the user and for the rest of the date we are typing it manually.
                        $lte : new Date(`${year}-12-31`) //using $lte (less than or equal) property of mongoose or mongo and inside $lte providing new date and inside new date we are inserting the year which is entered by the user and for the rest of the date we are typing it manually.

/*Lets understand what we are doing with all these dates things
we are matching startDates which cotains all the multiple dates which are of a paticular NFT and we are
separating all the dates with the $unwind property and then with the all the separated dates we are matching
the year which the user has entered.
We are taking that year and adding rest of the date manually
we are saying that the date should be greater or equal to 1st january and any year(entered by the user)
and date should be less than 31st December and any year(entered by the user).

This means we are searching/matching the NFT date only between these date means in short we are covering 
whole year from 1st january to 31st december and any date which would get fall between that particular year
(which is entered by the user) that NFT will gonna be shown to the user.*/


                    }

                }

            },

            {

/*With this we are grouping the data on the basis of startDates which is present in NFTs.
And with $month we are showing that the NFT belong to which month and all the NFTs which would be created
in that month will be grouped together and will be shown togetherly.*/

                _id : {$month : "$startDates"},
                numNFTStarts : {$sum : 1}, //Showing total number of NFTs which gets fell inside in this particular month.Using $sum property of mongoose or mongo and inside it providing 1 so that we can get the total number of NFTs.
                nfts : {$push : "$name"} //And atlast pushing all the NFTs which fell under this group with the help of $push property of mongoose or mongo this will let us see all the names of the NFTs.

            },

            {

                $addFields : { //With this($addFields) property of mongoose or mongo we are adding a new field.

                    month : "$_id" //we are setting month equal to the id we are getting as in id we are getting the number of month in which the NFT has been created, therefore we are entering that number into the month field.

                }

            },

            {
                $project : { //With $project property of mongoose or mongo we can hide any field which we want to hide.

                    _id : 0 //just enter the field name which we want to hide here in this case is _id and by setting the value to 0 that field will not gonna be shown into our data.
                    
                }

            }

        ])

        res.status(200).json({ //sending the response in json form.

            status : "Success", //setting the status to Success.
            data : plan //And in resposne we are sending the plan in which we have stored our all data.

        })
        

})


