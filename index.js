const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const query = {};
            const result = await addBillingCollection.find(query).sort({ $natural: -1 }).skip(page * size).limit(size).toArray();
            const count = await addBillingCollection.estimatedDocumentCount();
            res.send({ count, result })
        })

        // delete billing data
        app.delete('/delete-billing/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await addBillingCollection.deleteOne(query);
            res.send(result);
        })

        // specific billing data
        app.get('/add-billing/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await addBillingCollection.findOne(query);
            res.send(result);
        })

        // update billing data
        app.put('update-billing/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const bill = req.body;
            const option = { upsert: true };
            const updateBill = {
                $set: {
                    name: bill.name,
                    email: bill.email,
                    phone: bill.phone,
                    amount: bill.amount
                }
            }
            const result = await addBillingCollection.collection(filter, updateBill, option);
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