const express = require("express")
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware
app.use(cors())

// dorkar1
// s9NEgRMSTvbZ3bZA
//from information.ins email


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://dorkar1:s9NEgRMSTvbZ3bZA@cluster0.olby26b.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const postCollection = client.db('dorkar').collection('products');

    // Post collection
    app.get('/addPost' , async(req, res) => {
        const result = await postCollection.find().toArray();
        res.send(result)
    })
    app.post('/addPost', async(req, res) => {
        const newPost = req.body;
        const result = await postCollection.insertOne(newPost);
        res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("server is running from backend")
})
app.listen(port, (req, res) => {
    console.log(`Server is running on port ${port}`);
})