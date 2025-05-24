const express = require('express');
const cors = require('cors')
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express()


app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t3igz9r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {

    const userCollection = client.db('userDb').collection('users')
    const ListingCollection = client.db('userDb').collection('addListing')
    const feauredCollection = client.db('userDb').collection('featuredListings')
    

    app.get('/users', async(req, res) =>{
      const email = req.query.email;
      if(email){
        const result = await userCollection.findOne({email})
        return res.send(result)
      }
        const result = await userCollection.find().toArray()

        res.send(result)
    })


    app.put('/users/:email', async(req, res) =>{
      const email = req.params.email;
      const query = {email:email};
      const updateProfile = req.body;
      const updateDoc = {
        $set : updateProfile
      }
      const result = await userCollection.updateOne(query, updateDoc)
      res.send(result)
    })

    
    app.post('/users', async(req, res) =>{
          const userProfile =req.body;
          console.log(userProfile)
          const result = await userCollection.insertOne(userProfile)
          res.send(result)

      })

    app.get('/addListing', async(req,res) =>{
      const result = await ListingCollection.find().limit(6).toArray()
      res.send(result)
    })
    app.get('/featuredListings', async(req, res)=>{
      const result = await feauredCollection.find().toArray()
      res.send(result)
    })
 
    app.get('/addListing/:id',async(req, res) =>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}

      let result = await ListingCollection.findOne(query)

      if(!result){
         result = await feauredCollection.findOne(query)
      }
      if(!result){
        return res.status(404).send({message: 'item no found'})
      }

      res.send(result)
    })

    app.get('/myListing', async(req, res)=>{
      const userEmail = req.query.email;
      const query = {email: userEmail};
      const result = await ListingCollection.find(query).toArray()
      res.send(result)
    })

   app.put('/addListing/:id', async(req, res) =>{
    const id = req.params.id;
    const filter = {_id : new ObjectId(id)};
    const updatePage = req.body;
    const updateDoc = {
      $set : updatePage
    } 
    const result = await ListingCollection.updateOne(filter, updateDoc)
    res.send(result)
   }) 

   app.delete('/addListing/:id' , async(req, res) =>{
    const id = req.params.id;
    const  query = {_id: new ObjectId(id)}
    const result = await ListingCollection.deleteOne(query)
    res.send(result)
   })

    app.put('/addListing/like/:id', async(req, res)=>{
      const id =req.params.id;
      const query = {_id : new ObjectId(id)}
      const update = {$inc: {likes: 1}}
      const result = await ListingCollection.updateOne(query, update)
      res.send(result)
    })


    
    
    app.post('/addListing', async(req, res) =>{
      const addData = req.body;
      const result = await ListingCollection.insertOne(addData)
      res.send(result)
    })
    
    


  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res)=>{
    res.send('server is running')
})

app.listen(port, () =>{
    console.log(`server is gon ${port}`)
})



