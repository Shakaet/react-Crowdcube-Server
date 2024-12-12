const express = require('express')
const app = express()
var cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 3000


app.use(express.json())
app.use(cors())

// crowdFunding

// SxjXu0uIjEE82V0c
console.log(process.env.DB_USER)



app.get('/', (req, res) => {
  res.send("hello")
})


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_Pass}@cluster0.bnqcs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();
    const database = client.db("insertcampaign");
    const campaignDetails = database.collection("campaignDetails");
    const donatedCollection = database.collection("donatedCollection");


    app.get("/myCampaign",async(req,res)=>{
      const { email } = req.query;
      let query={email}
      const result = await campaignDetails.find(query).toArray();

      res.send(result)
    })

    
    



    app.get("/addcampaign/:id",async(req,res)=>{


      let idx=req.params.id
      const query = { _id: new ObjectId(idx) };

      const result = await campaignDetails.findOne(query);

      res.send(result)


    })

    app.get("/runningCampaigns", async (req, res) => {
      try {
        const { limit } = req.query;
        const currentDate = new Date(); // Get the current date
    
        const query = { deadline: { $gte: currentDate.toISOString() } }; // Check campaigns with deadlines not passed
        const cursor = campaignDetails.find(query).limit(parseInt(limit) || 6);
        const campaigns = await cursor.toArray();
    
        res.send(campaigns);
      } catch (error) {
        res.status(500).send({ error: "Failed to fetch running campaigns." });
      }
    });
    
    

   
    



    app.get("/addcampaign",async(req,res)=>{

      const cursor = campaignDetails.find();
      let result= await cursor.toArray()
      res.send(result)


    })

    app.get("/donated-collection",async(req,res)=>{

      const { donorEmail } = req.query;
      let query={donorEmail}
      const result = await donatedCollection.find(query).toArray();

      res.send(result)


    })

    app.post("/donated-collection",async(req,res)=>{

      let collection= req.body

      const result = await donatedCollection.insertOne(collection);

      res.send(result)




    })

    app.post("/addcampaign",async(req,res)=>{

      let campaign= req.body

      const result = await campaignDetails.insertOne(campaign);

      res.send(result)




    })


    app.delete("/myCampaign/:id",async(req,res)=>{
      let idx=req.params.id
      const query = { _id: new ObjectId(idx) };
      const result = await campaignDetails.deleteOne(query);
      res.send(result)
    })

    app.put("/updateCampaign/:id",async(req,res)=>{

      let idx=req.params.id
      const updatedData = req.body;
      console.log(req.body)
      const filter = { _id: new ObjectId(idx) };
  

      const updateDoc = {
        $set: {
          image:req.body.image,
          title:req.body.title,
          type:req.body.type,
          description:req.body.description,
          minDonation:req.body.minDonation,
          deadline:req.body.deadline
          
        },
      };

      const result = await campaignDetails.updateOne(filter, updateDoc);
      res.send(result)

    })





    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})