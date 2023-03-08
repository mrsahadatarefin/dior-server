const express = require('express')
const cors = require ('cors')
const app = express()
require('dotenv').config()

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000







// middle wares
app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.w5yg5ut.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run (){

try{

    const singleCategoryCollection = client.db('diorClub').collection('singleCategory')
    
    const categoryCollection = client.db('diorClub').collection('category')
    const ordersCollection = client.db('diorClub').collection('orders')
    const usersCollection = client.db('diorClub').collection('users')

    app.get('/categoryName', async (req,res) =>{
        const query ={};
        const result = await singleCategoryCollection.find(query).toArray();
      res.send(result);


    })

    // app.post('/category',async (req,res)=>{

    //     const category = req.body;
    //     const result = await categoryCollection.insertOne(category);
    //     res.send(result)


    // })
    app.post('/users',async(req,res)=>{

        const user = req.body;
        console.log(user)
        const result = await usersCollection.insertOne(user);
        res.send(result) 
    })

    app.get('/orders',async (req,res)=>{
   
 const email = req.query.email;
 const query = {email:email};
 const result = await ordersCollection.find(query).toArray();
 res.send(result)

    })

    app.post('/orders', async(req,res)=>{
        const order =req.body
       
        const result = await ordersCollection.insertOne(order)
        res.send(result)
        
    })

    app.get('/category/by',async(req,res)=>{
        const category = req.query.category;
        const query ={category:category};
       
        const services =await categoryCollection.find(query).toArray();
        res.send(services)
    })
   
    app.get('/category/:id',async(req,res)=>{
        const id = req.params.id;
      const query = {_id:new ObjectId(id)};
      const result = await categoryCollection.findOne(query);
      res.send(result);

    })
   



}
finally{

}

}run().catch (err => console.error(err));






app.get('/',(req,res)=>{
    res.send('dior car server is running')
})




app.listen(port,()=>{
    console.log(`dior server is running on ${port}`)
})