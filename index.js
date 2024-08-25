const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());

//mongodb connection
const uri =
  "mongodb+srv://mugdho1828:bZcmIjqenvlMFzmH@cluster0.6ae8n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

//database collections
const dbBooks = client.db("bookCycle").collection("books");

//database connection function
const dbConnection = async () => {
  try {
    await client.connect();
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Database connection error", error.name, error.message);
  }
};
dbConnection();

//post a book
app.post("/books", async (req, res) => {
  try {
    const result = await dbBooks.insertOne(req.body);
    if (result.insertedId) {
      res.send({
        status: true,
        data: result.insertedId,
      });
    } else {
      res.send({
        status: false,
        data: "something wrong",
      });
    }
  } catch (err) {
    console.log(err.name, err.message);
    res.send({
      status: false,
      data: err.name,
    });
  }
});

//get books
//for limited services query params "limit" should be added
app.get("/books", async (req, res) => {
  try {
    const cursor = dbBooks.find({});
    const books = await cursor
      .limit(parseInt(req.query.limit))
      .sort({ timeObj: -1 })
      .toArray();
    res.send({
      status: true,
      data: books,
    });
  } catch (err) {
    console.log(err.name, err.message);
    res.send({
      status: false,
      data: err.name,
    });
  }
});

//get books by book id
app.get("/book", async (req, res) => {
  try {
    const book = await dbBooks.findOne({ _id: new ObjectId(req.query.id) });
    res.send({
      status: true,
      data: book,
    });
  } catch (err) {
    console.log(err.name, err.message);
    res.send({
      status: false,
      data: err,
    });
  }
});

//get books by category
app.get("/category", async (req, res) => {
  try {
    const cursor = dbBooks.find({ category: req.query.categoryName });
    const books = await cursor.sort({ postTime: -1 }).toArray();
    res.send({
      status: true,
      data: books,
    });
  } catch (err) {
    console.log(err.name, err.message);
    res.send({
      status: false,
      data: err.name,
    });
  }
});

app.get("/", (req, res) => {
  res.send("Server is Up...");
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});

//password= bZcmIjqenvlMFzmH (mongodb atlas user mugdho1828)
