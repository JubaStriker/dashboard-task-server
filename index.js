const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require("dotenv").config()
const app = express();

app.use(cors())
app.use(express.json());

const uri = process.env.DB_URI;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const usersCollection = client.db('Dashboard').collection('users');

        app.post('/dashboard', async (req, res) => {
            const dashboardData = req.body;
            const result = usersCollection.insertOne(dashboardData);
            res.send(result);
        })

        app.post('/dashboardg', async (req, res) => {
            const dashboardData = req.body;
            const query = {
                userEmail: dashboardData.userEmail
            }
            const alreadyUser = await usersCollection.find(query).toArray();
            if (alreadyUser.length) {
                const message = 'User exists'
                return res.send({ acknowledged: false, message: message })
            }
            const result = usersCollection.insertOne(dashboardData);
            res.send(result);
        })

        app.get('/dashboard', async (req, res) => {
            const email = req.query.email;
            const query = { userEmail: email }
            const dashboardData = await usersCollection.findOne(query)
            res.send(dashboardData);
        });
    }
    finally {

    }
}

run().catch(console.log);

app.get('/', async (req, res) => {
    res.send("dashboard server running")
});

app.listen(port, () => {
    console.log(`dashboard server running on port ${port}`);
});