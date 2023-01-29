const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middle ware
app.use(cors());
app.use(express.json());







const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.v0q5o0h.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const addBillingCollection = client.db('power-hack').collection('add-bill');

        // add billing post
        app.post('/add-billing', async (req, res) => {
            const query = req.body;
            const result = await addBillingCollection.insertOne(query);
            res.send(result)
        })

        // add billing get
        app.get('/add-billing', async (req, res) => {
            const query = {};
            const result = await addBillingCollection.find(query).sort({ $natural: -1 }).toArray();
            res.send(result)
        })

    }
    finally { }
}
run().catch(console.log);


app.get('/', (req, res) => {
    res.send('running');
})

app.listen(port, () => {
    console.log(port)
})