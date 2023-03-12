const express = require('express');

require('dotenv').config();

const morgan = require('morgan');

const nftRouter = require('../src/Routes/nftsRoutes');

const app = express();

app.use(express.json());

app.use(morgan('dev'));

app.use(nftRouter);

const port = process.env.PORT;

app.listen(port , () => {

    console.log(`Server is running on port ${port}`);


})