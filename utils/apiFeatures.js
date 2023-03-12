/* In this file we are making a class which we can use in separate files and
 we dont have to make another function for the same.*/

 const NFT = require('../src/ModelsAndSchemas/nftModel'); //improting our model to use it.

 class APIFeatures { //Defining a class with the help of class keyword and defining the class name (remember to keep the first letter of class name in uppercase as it is a good practice to keep it in upper case).
 
 /*defining a constructor and inside we are providing 2 parameters
 1st parameter is query which will store the entire data which is coming in the form of query.
 2nd parameter is queryString through which the users are making query and we have to filter
 the data on the basis of this.*/
 
 
     constructor(query , queryString){ 
         this.query = query; //we are doing this to target the current query as we already know the work of this keyword.
         this.queryString = queryString; //we are doing this to target the current queryString as we already know the work of this keyword.
 
     }
 
     filter(){//Making a new function and inside it we are gonna write our full code for filtering.
 
                                 //QUERY FUNCTIONALITY
 
         let queryObj = {...this.queryString};  //By doing this we are getting  the data which the user has requested so that we can filter that data.
 
         let excludedFields = ["page" , "sort" , "limit" , "fields"]; //making an array and inside it writing the names of the fields which want to be remain excluded.
     
         excludedFields.forEach((el) => delete queryObj[el]); //then on the array we made we are using .forEach method on it this will give us the new array and inside we are saying if the user request for any of the field which are present inside excludedFields then delete that field from the request of the user.
 
         let query = NFT.find(queryObj); //And now data will be found according to request which is requested by the user and modified by us.
 
                 
             //This(below) is not that much important so you can skip it.
 
                             //ADVANCE FILTERING QUERY
 
         let queryStr = JSON.stringify(queryObj); 
 
         queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g , (match) => `$${match}`);
 
         this.query = this.query.find(JSON.parse(queryStr));
 
         return this; //its important to return this otherwise we wouldnt be able to use it.
 
 
     }
 
     sort(){ //making a new function inside which we gonna write all the code for sorting.
 
         if(this.queryString.sort){ //w are checking with the  if else statement that if the user is requesting for .sort method , if that so then run the below code.
 
             const sortBy = this.queryString.sort.split(",").join(" "); //by writing this we are sorting the data and  if the user want to sort the data on the multiple fields then we are separating all the fields with a comma(,) and then joining it with some space so that systam can analyze the data easily.
 
             console.log(sortBy);
 
             this.query = this.query.sort(sortBy); //when the user will call sort method , he/she will get to see the sorted data.
 
 
         }else{
 
             this.query = this.query.sort("-createdAt") //if someone is not looking for any query then the data will gonna be sort by the createdAt field this will be the default sorting.
 
         }
 
         return this; //its important to return this otherwise we wouldnt be able to use it.
 
 
     }
 
     limitFields(){ //making a new function inside which we gonna write all the code for limitFields.
 
                         //FIELDS LIMITING
 
 
         if(this.queryString.fields){ //If the user is requesting for the data on the basis of fields then this code will be envoked.
 
             const fields = this.queryString.fields.split(",").join(" "); //by writing this we are seeing the fields which the user is entering and if the user entered  multiple fields then we are separating all the fields with a comma(,) and then joining it with some space so that systam can analyze the fields easily.
                 
             this.query = this.query.select(fields) //we are sending the data on the basis of the fields entered by the user.
                 
         }else{
                 
             this.query = this.query.select("-__v"); // if the user has not entered any fields then inside our resulted data __v gonna be hide/removed. 
                 
         }
 
         return this; //its important to return this otherwise we wouldnt be able to use it.
 
 
     }
 
     pagination(){ //making a new function inside which we gonna write all the code for pagination.
 
                     //PAGINATION FUNCTIONALITY
 
         const page = this.queryString.page * 1 || 1; //if the user has entered any page number multiplying it with 1 to covert the user input into number then storing it otherwise the default value of page is 1.
 
         const limit = this.queryString.limit * 1 || 2; //if the user has entered any limit multiplying it with 1 to covert the user input into number then storing it otherwise the default value of limit is 2 means only 2 NFts will gonna be shown on a single page. 
             
         const skip = (page - 1) * limit; //if we are om page number 2 then after -1 it would be 1 and then we are multiplying it with limit this means 2 would be the ans and this will be the data which we want to skip to show the next NFTs.
             
         this.query = this.query.skip(skip).limit(limit); //atlast using .skip and .limit method and inside it providing the skip variable and limit variable to set the skip amount means how much NFTs has to skipped and also to set the limit to be shown limited NFTs on that particular page.
     
          return this; //its important to return this otherwise we wouldnt be able to use it.
 
 
     }
 
 }
 
 module.exports = APIFeatures; //exporting this file to use it in another files.