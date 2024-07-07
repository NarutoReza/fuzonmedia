const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();

app.use(bodyParser.json());
const Router = require('./Routes/Router');
app.use('/', Router);

const PORT = process.env.PORT || 8080

mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log('MongoDB database is connected and live...!') )
    .catch(() => console.log('Server Error') )

app.listen(PORT, () => {
    console.log(`Server is up and running on ${PORT}`)
})