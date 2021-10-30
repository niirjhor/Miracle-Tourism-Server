const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectId;

const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jrh7n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        console.log('connected to database');
        console.log("Connected");

        const database = client.db('tourismOffers');
        const packagesCollection = database.collection('packages');
        const bookingConfirmations = database.collection('bookingConfirmations')
        const hotelsCollections = database.collection('packages2')
        //Get Packages API

        app.post('/packages', async (req, res) => {

            const package = req.body;
            console.log('hit the post', package);
            const result = await packagesCollection.insertOne(package);
            console.log(result);
            res.json(result)
        })
        //Get Bookings API
        app.post('/bookingConfirmations', async (req, res) => {

            const package = req.body;
            console.log('hit the post', package);
            const result = await bookingConfirmations.insertOne(package);
            console.log(result);
            res.json(result)
        })
        app.get('/bookingConfirmations', async (req, res) => {
            const cursor = bookingConfirmations.find({});
            const packages2 = await cursor.toArray();
            res.send(packages2)
        })

        // GET Full API

        app.get('/packages', async (req, res) => {
            const cursor = packagesCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages)
        })


        //Get Single API
        app.get('/packages/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific ID', id);
            const query = { _id: ObjectID(id) };
            const package = await packagesCollection.findOne(query);
            res.json(package);
        })

        //Delete API

        app.delete('/bookingConfirmations/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectID(id) };
            const result = await bookingConfirmations.deleteOne(query);
            res.json(result);
        })

        //Get confirmation single API

        app.put('/bookingConfirmations/:id', async (req, res) => {
            const id = req.params.id;
            const updatedOrder = req.body;
            console.log('getting specific ID', id);
            const filter = { _id: ObjectID(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updatedOrder.status
                },
            };

            const result = await bookingConfirmations.updateOne(filter, updateDoc, options)
            res.json(result)
        })

        //Get hotels API

        app.post('/packages2', async (req, res) => {

            const hotelPackage = req.body;
            console.log('hit the post', hotelPackage);
            const result = await hotelsCollections.insertOne(hotelPackage);
            console.log(result);
            res.json(result)
        })

        app.get('/packages2', async (req, res) => {
            const cursor = hotelsCollections.find({});
            const packages2 = await cursor.toArray();
            res.send(packages2)
        })


    }
    finally {
        // await client.close();
    }
}


run().catch(console.dir)



app.get('/', async (req, res) => {
    res.send('tourism server running');
})

app.listen(port, () => {
    console.log("Tourism Server is Running on", port);
})