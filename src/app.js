const express = require('express');

require('dotenv').config();

const morgan = require('morgan');

const nftModel = require('./ModelsAndSchemas/nftModel');

const app = express();

app.use(express.json());

app.use(morgan('dev'));

app.use(nftModel);

const port = process.env.PORT;

app.listen(port , () => {

    console.log(`Server is running on port ${port}`);


})