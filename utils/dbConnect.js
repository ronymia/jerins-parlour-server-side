const { MongoClient, ServerApiVersion } = require("mongodb");

// MongoClient implementation
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@helloworld.sp1mde2.mongodb.net`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let databaseConnection;

module.exports = {
    connectToDatabase: async function () {
        try {
            databaseConnection = await client.connect();
            await client.db("admin").command({ ping: 1 });
            console.log("Pinged your deployment. You successfully connected to MongoDB!");
        } catch (error) {
            console.error(error);
        }
    },
    getDatabase: function () {
        return databaseConnection.db("jerins_parlour");
    }
}
