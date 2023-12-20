const express = require('express');
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId, CURSOR_FLAGS } = require('mongodb');

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

//verify token
const verifyJWT = (req, res, next) => {
     const authorization = req.headers.authorization;
     if (!authorization) {
          return res.status(401).send({ message: 'unauthorizated access' });
     }

     // bearer token
     const token = authorization.split(" ")[1];
     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (error, decode) {
          if (error) {
               console.log(error)
               return res.status(401).send({
                    error: true,
                    message: 'Invalid token'
               })
          }
          req.decode = decode;
          next();
     })
}

async function run() {
     try {
          // Connect the client to the server	(optional starting in v4.7)
          await client.connect();

          const userCollection = client.db("jerins_parlour").collection("users");
          const serviceCollection = client.db("jerins_parlour").collection("services");
          const bookingCollection = client.db("jerins_parlour").collection("bookings");
          const reviewCollection = client.db("jerins_parlour").collection("reviews");

          // token create
          app.post("/jwt", async (req, res) => {
               const user = req.body;
               const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "100000day" });
               res.send(token);
          })

          //user related apis
          app.post("/createNewUser", async (req, res) => {
               const userInfo = req.body;
               const query = { email: userInfo.email };
               //user already exist or not
               const existUser = await userCollection.findOne(query)
               if (existUser) {
                    return res.send({ message: "user already exist" })
               } else {
                    //brand new user
                    const newUser = await userCollection.insertOne(userInfo);
                    res.status(200).send(newUser);
               }
          })

          app.get("/users", async (req, res) => {
               const result = await userCollection.find().toArray();
               res.send(result);
          })



          // admin related apis
          app.get("/users/admin/:email", verifyJWT, async (req, res) => {
               const email = req.params.email;
               const decodedEmail = req.decode.email;
               if (email !== decodedEmail) {
                    res.send({ admin: false });
               }

               const query = { email: email };
               const user = await userCollection.findOne(query);
               const result = { admin: user?.role === 'admin' };
               res.send(result);
          })


          app.patch("/user/admin/:id", async (req, res) => {
               const userId = req.params.id;
               const filter = { _id: new ObjectId(userId) };
               const updateDoc = {
                    $set: {
                         role: 'admin'
                    },
               };
               const admin = await userCollection.updateOne(filter, updateDoc);
               res.send(admin);
          })




          // service related api
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
          app.get("/bookings", verifyJWT, async (req, res) => {
               const email = req.query.email;
               const query = { email: email };
               const decodedEmail = req.decode.email;

               if (email !== decodedEmail) {
                    return res.status(403).send({ error: true, message: 'forbidden access' })
               }

               const bookings = await bookingCollection.find(query).toArray();
               res.send(bookings);
          })

          app.post("/bookings", async (req, res) => {
               const bookingInfo = req.body;
               const booked = await bookingCollection.insertOne(bookingInfo);
               res.status(200).send(booked);
          })

          app.delete('/cancelBooked/:bookedId', async (req, res) => {
               const bookedId = req.params.bookedId;
               const query = { _id: new ObjectId(bookedId) };
               const result = await bookingCollection.deleteOne(query);
               res.send(result);
          })

          app.get("/orderList", async (req, res) => {
               const bookings = await bookingCollection
                    .find().skip(10)
                    .toArray();
               res.send(bookings);
          })

          // review related apis
          app.post("/createMyReview", async (req, res) => {
               const reviewData = req.body;
               const result = await reviewCollection.insertOne(reviewData);
               res.send(result);
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
