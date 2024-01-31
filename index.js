const express = require("express")
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())

// dorkar1
// s9NEgRMSTvbZ3bZA
//from information.ins email

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_SECRET}@cluster0.olby26b.mongodb.net/?retryWrites=true&w=majority`;

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
    app.get('/addPost/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const option = {
        projection:{title: 1, price: 1, division: 1}
        // which list from products show 1 , do not show 0
      }
      const result = await postCollection.findOne(query);
      res.send(result)
    })
    app.get('/addPost' , async(req, res) => {
      console.log("from email",req.query.email);
      let query = {};
      if(req.query?.email){
        query={email: req.query.email}
      }
      /* // const query = { price: { $lt: 45, $gt: 15 } };
      const options = {
        // Sort returned documents in ascending order by title (A->Z)
        // sort: { _id: -1 }
        // Include only the `title` and `imdb` fields in each returned document
        // projection: { _id: 0, title: 1, imdb: 1 },
      }; */
        const result = await postCollection.find(query).sort({_id:1}).toArray();
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