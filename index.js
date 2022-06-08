const PORT = process.env.PORT || 8000
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const mongoose = require('mongoose');
const rateSchema = require("./models/rate");
const {request} = require("express");

const app = express()

app.use(express.urlencoded({extended: true}));
app.use(express.json());

let varlix = {};
const varlixUrl = 'https://www.varlix.com.uy/';

//const uri = 'mongodb+srv://uyexc_access:H3hYEaGULSjKIfS0@uy-exchange.7ctpb.mongodb.net/?retryWrites=true&w=majority';

try {
    mongoose.connect(
        "mongodb+srv://uyexc_access:H3hYEaGULSjKIfS0@uy-exchange.7ctpb.mongodb.net/?retryWrites=true&w=majority",
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        () => console.log("Mongoose is connected")
    );
} catch (err) {
    console.log("Could not connect")
}

app.get('/', (req, res) => {
    res.json('UYU.EXCHANGE API to get the current rates for the UYU (Peso) against other main currencies in Uruguay USD, ARS, BRL and EUR.')
})

app.get('/varlix', (req, res) => {
    //Path to file
    const filePath = path.join(__dirname,'_data', 'varlix.json');
    //Read file and displays
    fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
        if (!err) {
            res.data;
            res.writeHead(200, {'Content-Type': 'json'});
            res.write(data);
            res.end();
        } else {
            console.log(err);
        }
    });
})

const varlixQuotes = async() => {
    const {data} = await axios.get(varlixUrl);
    const $ = cheerio.load(data);
    $('.exchange').each(function () {
        $('.exchange-line:contains("Dólar")').each(function () {
            const source = "Varlix";
            const url = varlixUrl;
            const currency = $('.currency', this).text().replace("Dólar Americano", "USD");
            const buy = $('.buy', this).text();
            const sell = $('.sell', this).text();
            const timestamp = new Date();
            varlix = ({
                source,
                url,
                currency,
                buy,
                sell,
                timestamp
            })
        })
    })
    console.log(varlix);
    console.log("Todo-ok");
    //Save data into fs
    fs.writeFile(path.join(__dirname, '_data', 'varlix.json'), JSON.stringify(varlix), err => {
        if (err) {
            console.error(err);
        } else {
            console.log("Success");
        }
    });

    //var Model = mongoose.model("model", schema, "myCollection");
    //const Rate = mongoose.model("Rate", ratesSchema);
    //varlixOne = JSON.stringify(varlix);

    let doc1 = new rateSchema(varlix);
    console.log(doc1)
    console.log(varlix)
    doc1.save(function(err, doc) {
        if (err) return console.error("Error");
        console.log("Document inserted succussfully!");
    });

    /*
    app.post(JSON.stringify(varlix, this), async(req,res) => {
        let newRateIn = new rateSchema(varlix.body);
        console.log('This is a file' + newRateIn);
        try {
            await newRateIn.save();
            //response.send(newRateIn);
            res.status(200).send(newRate);
            console.log("Ok - Saved");
        } catch (error) {
            res.status(500).send(error);
            console.log("Error when trying to post");
        }
    });

     */
    /*
    app.post(path.join(__dirname, '_data', 'varlix.json'), async(req, res) => {
        const newRate = new rateSchema(request.body);
        console.log(newRate);
        try {
            await newRate.save();
            //response.send(newRate);
            res.status(200).send(newRate);
            console.log("Ok - Saved");
        } catch (error) {
            res.status(500).send(error);
            console.log("Error when trying to post");
        }
    });

     */

    varlix = {};
};

//Cron job to refresh the rates every xx minutes
cron.schedule('* * * * *', () => {
    varlixQuotes();
}, {
    scheduled: true,
    timezone: "America/Montevideo"
});


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

/*
app.post("/rate", async (request, response) => {
    const newRate = new rateSchema(request.body);
    console.log(newRate);
    try {
        await newRate.save();
        response.send(newRate);
        console.log("Ok - Saved");
    } catch (error) {
        response.status(500).send(error);
        console.log("Error when trying to post");
    }
});
 */

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))

module.exports = app;