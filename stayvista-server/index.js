const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken')

const port = process.env.PORT || 5000  //8000

// middleware
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions))

app.use(express.json())
app.use(cookieParser())

// Verify Token Middleware
const verifyToken = async (req, res, next) => {
  const token = req.cookies?.token
  console.log(token)
  if (!token) {
    return res.status(401).send({ message: 'unauthorized access' })
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log(err)
      return res.status(401).send({ message: 'unauthorized access' })
    }
    req.user = decoded
    next()
  })
}



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iam7h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const database = client.db('stayvista');
    const rooms = database.collection('rooms');
    const users = database.collection('users');



    // auth related api
    app.post('/jwt', async (req, res) => {
      const user = req.body
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '365d',
      })
      res
        .cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
        .send({ success: true })
    })


    // Logout
    app.get('/logout', async (req, res) => {
      try {
        res
          .clearCookie('token', {
            maxAge: 0,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
          })
          .send({ success: true })
        console.log('Logout successful')
      } catch (err) {
        res.status(500).send(err)
      }
    })



    // Saved user in DB
    app.put('/user', async (req, res) => {
      try {
        const user = req.body;
        const query = { email: user?.email }
        // check if user already exists in db
        const isExsit = await users.findOne(query);

        if (isExsit) {
          if (user.status === 'Requested') {
            // if existing user try to change his role
            const result = await users.updateOne(query, { $set: { status: user?.status } });
            return res.send(result);
          } else {
            return res.send(isExsit)
          }
        }

        // save user for the first time
        const options = { upsert: true };
        const updatedDoc = {
          $set: {
            ...user,
            timestamp: Date.now()
          }
        }

        const result = await users.updateOne(query, updatedDoc, options);
        res.send(result)

      } catch (error) {
        res.status(500).send({ success: false, message: 'Internal Server Error' });
      }
    })


    //Get the user status
    app.get('/user/:email', async (req, res) => {
      try {
        const email = req.params.email;
        const query = { email: email };
        const result = await users.findOne(query);
        res.send(result)

      } catch (error) {
        res.status(500).send({ success: false, message: 'Internal Server Error' });
      }
    })



    // Get the all rooms data
    app.get('/rooms', async (req, res) => {
      try {
        const category = req.query?.category;
        // initially value of vategory is String: null not 
        let query = {};
        if (category && category !== 'null') {
          query = { category: category }
        }

        const cursor = rooms.find(query);
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ success: false, message: 'Internal Server Error' });
      }
    })



    //Get individual Data
    app.get('/rooms/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await rooms.findOne(query);
        res.send(result);
      } catch (error) {
        res.status(500).send({ success: false, message: 'Internal Server Error' });
      }
    })



    //Get the host's room for each individual person
    app.get('/my-listing/:email', async (req, res) => {
      try {
        const email = req.params.email;
        const query = { 'host.email': email };
        const result = await rooms.find(query).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ success: false, message: 'Internal Server Error' });
      }
    })



    //Insert a new Room
    app.post('/rooms', async (req, res) => {
      try {
        const body = req.body;
        const result = await rooms.insertOne(body);
        res.send(result)
      } catch (error) {
        res.status(500).send({ success: false, message: 'Internal Server Error' });
      }
    })

    // Delete Room
    app.delete('/room/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await rooms.deleteOne(query);
        res.send(result)
      } catch (error) {
        res.status(500).send({ success: false, message: 'Internal Server Error' });
      }
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
  res.send('Hello from StayVista Server..')
})

app.listen(port, () => {
  console.log(`StayVista is running on port ${port}`)
})
