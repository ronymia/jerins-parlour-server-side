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

          const userCollection = client.db("jerins_parlour").collection("users");
          const serviceCollection = client.db("jerins_parlour").collection("services");
          const bookingCollection = client.db("jerins_parlour").collection("bookings");

          //user related apis
          app.post("/createNewUser", async (req, res) => {
               const userInfo = req.body;
               const query = { emai: userInfo.email };
               //user already exist or not
               const existUser = await userCollection.findOne(query);
               if (existUser) {
                    return res.send({ message: "user already exist" })
               };

               //brand new user
               const newUser = await userCollection.insertOne(userInfo);
               res.status(200).send(newUser);
          })

          // all apis start here
          app.get("/services", async (req, res) => {
               const services = await serviceCollection.find().toArray();
               res.send(services);
          })

          app.get(("/service/:serviceId"), async (req, res) => {
               const serviceId = req.params.serviceId;
               const query = { _id: new ObjectId(serviceId) };
               const singleService = await serviceCollection.findOne(query);
               res.send(singleService);

          })

          //booking related apis
          app.get("/bookings", async (req, res) => {
               const email = req.query.email;
               const query = { email: email };
               const bookings = await bookingCollection.find(query).toArray();
               res.send(bookings);
          })

          app.post("/bookings", async (req, res) => {
               const bookingInfo = req.body;
               const booked = await bookingCollection.insertOne(bookingInfo);
               res.status(200).send(booked);
          })

          app.get("/orderList", async (req, res) => {
               const orderList = await bookingCollection.find().toArray();
               res.send(orderList);
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
