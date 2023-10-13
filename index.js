const express = require('express');
const app = express();
const cors = require("cors");
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const PORT = process.env.PORT || 5000;

//middleware Connection
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@helloworld.sp1mde2.mongodb.net/?retryWrites=true&w=majority`;

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

          const serviceCollection = client.db("jerins_parlour").collection("services");

          // all apis start here
          app.get("/services", async (req, res) => {
               const services = await serviceCollection.find().toArray();
               res.send(services);
          })

          app.get(("/booking/:serviceId"), async (req, res) => {
               const serviceId = req.params.serviceId;
               const query = { _id: new ObjectId(serviceId) };
               const singleService = await serviceCollection.findOne(query);
               res.send(singleService);

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

app.get("/", async (req, res) => {
     res.send("Hello from Jerin's parlour");
})
//connection
app.listen(PORT, () => {
     console.log("jerin's parlour server running on port", + PORT);
});
