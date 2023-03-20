const express = require('express'); //importing  express to use it 

const router = express.Router(); //initialising express Router to use it.


const nftAPIsData = require('../../Controllers/nftAPIsAllData'); //importing all the data of our APIs which we stored in another file.


                        //TOP 3 NFTs ROUTE


//This is our route to know the top 3 NFTs of all time.

router.route('/api/v1/nfts/top-3-nfts').get(nftAPIsData.aliasTopNFTs);

                        //NFT STATS ROUTE


//This is our route to know the stats of NFTs.We are doing all the same things like we have done below.

router.route('/api/v1/nfts/nfts-stats').get(nftAPIsData.getNFTsStats); 


                        //GET MONTHLY PLAN

//This is our route to know the monthly plan on the basis of year.We are doing all the same things like we have done below.

router.route('/api/v1/nfts/montly-plan/:year').get(nftAPIsData.getMonthlyPlan);


//This is the modern way of making route.Lets understand this.

router.route('/api/v1/nfts') //we are using the router which we defined at top which contains our express router. and with that we have to use .route method in which we have to defined our api URL, like we have defined here.
.get(nftAPIsData.getAllNfts) //after defining the router we can defined our routes like if we want to make a GET API just simply use .get as function like we have done here and inside this we gonna provide all the data of the API which we made in another file and as we are using combined importing(1st method of importing) we are using dot(.) to get that particular function. 
.post(nftAPIsData.makeNewNft);//similarly we can define POST API and inside provide the data of post api which is present inside our  another file.

router.route('/api/v1/nfts/:id') //we have made another router here means didnt defined these(below) routes on above router because there are some changes in our URL as we can see we have added :id field here therefore we have to make another router to define other APIs as those APIs URL needs :id.
.get(nftAPIsData.getSingleNft) //after defining the router we have defined our route to get single nft by providing the data of the API which we have imported.
.patch(nftAPIsData.updateNft)//similarly we have defined patch route with this user can data of its NFT.
.delete(nftAPIsData.deleteNft); // and at last we have defined delete route with this user can delete its NFT.


//We can use them combinely as we have done above.


module.exports = router; //exporting the router so that we can use it in another file.