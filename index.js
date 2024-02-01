const express = require("express")
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware
app.use(cors({
  origin:['http://localhost:5173'],
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())

// dorkar1
// s9NEgRMSTvbZ3bZA
//from information.ins email
console.log("Token ",process.env.SECRET_TOKEN)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_SECRET}@cluster0.olby26b.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

//middleware

const logger = async(req, res, next) => {
  console.log("called", req.host, req.originalUrl);
  next()
};
const verifyToken = async(req, res, next) => {
  const token = req.cookies?.token;
  if(!token){
    return res.status(401).send({message: "UnAuthorized access"})
  }
  jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
    if(err){
      return res.status(401).send({message: "Unauthorized access"})
    }
    //if token is valid it would be decoded
    console.log('value in the token', decoded);
    req.user = decoded;
    next()
  })

}
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const postCollection = client.db('dorkar').collection('products');

    // Auth related api
    app.post('/jwt', async(req, res) => {
      const user = req.body;
      console.log(user);
      const token = jwt.sign(user, 'secret', {expiresIn:'50h'})
      res
      .cookie('token', token , {
        httpOnly: true,
        secure: false,
        // sameSite: 'none'
      })
      .send({success: true})
    })
    app.post('/logout', async(req, res) => {
      const user = req.body;
      res.clearCookie('token', {maxAge: 0}).send({success: true})
    })

    // Post collection
    app.get('/addPost/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
     /*  const option = {
        projection:{title: 1, price: 1, division: 1}
        // which list from products show 1 , do not show 0
      } */
      const result = await postCollection.findOne(query);
      res.send(result)
    })

    app.get('/addPost' , async(req, res) => {
      /* const page = parseInt(req.query.page) || 0;
      const size = parseInt(req.query.size) || 10;
      const skip = page * size;
      console.log("page", page,"size", size); */
      /*  let query = {};
      if(req.query?.email){
        query={email: req.query.email}
      }  */
        const result = await postCollection.find().sort({_id:1}).toArray();
        res.send(result)
    })
    app.get('/productsCount', async(req, res) =>{
      const count = await postCollection.estimatedDocumentCount();
      res.send({count})
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