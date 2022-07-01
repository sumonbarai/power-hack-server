const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
// Middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.3pzd9.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const billingCollection = client.db("powerHack").collection("billing-list");
    // get api
    app.get("/billing-list", async (req, res) => {
      const query = {};
      const cursor = billingCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    //  post api
    app.post("/add-billing", async (req, res) => {
      const insertedBill = req.body;
      const result = await billingCollection.insertOne(insertedBill);
      res.send(result);
    });
    // update api
    app.put("/update-billing/:id", async (req, res) => {
      const id = req.params.id;
      const updatedBill = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: updatedBill,
      };
      const result = await billingCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
    // delete api
    app.delete("/delete-billing/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await billingCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is running my project");
});

app.listen(port, () => {
  console.log(`server is running ${port}`);
});
