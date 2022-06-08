const express = require("express");
const rateSchema = require("../models/rate.js");
const app = express();

/*
app.post("/rate", async (request, response) => {
    const newRate = new rateSchema(request.body);
    console.log(newRate);
    try {
        await newRate.save();
        //response.send(newRate);
        response.status(200).send(newRate);
        console.log("Ok - Saved");
    } catch (error) {
        response.status(500).send(error);
        console.log("Error when trying to post");
    }
});

 */

module.exports = app;