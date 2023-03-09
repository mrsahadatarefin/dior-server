const express = require('express')
const cors = require ('cors')
const app = express()
require('dotenv').config()
const stripe = require("stripe")('sk_test_51MjewJLDPp6NgYfu9qsvWthDs8zy2asC6o5ZvrThntNlx3qG55BcSHIOxG6MaRGEXlWg0jprS0OtnBoy4JMdrjXK00WRtqiiOJ');

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
    const paymentCollection = client.db('diorClub').collection('paymentUser')

    app.get('/categoryName', async (req,res) =>{
        const query ={};
        const result = await singleCategoryCollection.find(query).toArray();
      res.send(result);


    })

    app.post('/payment', async(req,res)=>{
        const payment = req.body;
        const result =  await paymentCollection.insertOne(payment)
        res.send(result)

    })

    app.post('/create-payment-intent',async (req,res)=>{
    
        const allSum = req.body;
        const price = allSum.allSum;
        const amount = price*100;
        const paymentIntent = await stripe.paymentIntents.create({
            currency:'usd',
            amount:amount,

            "payment_method_types": [
                "card"
              ],
              

        })
        res.send({
            clientSecret: paymentIntent.client_secret,
          });



    })

app.get('/users/admin/:email',async (req,res)=>{
    const email = req.params.email

    const query = {email:email}
    const user = await usersCollection.findOne(query);
    res.send({isAdmin:user?.role ==='admin'})


})

    app.put('/users/admin/:id',async (req,res)=>{

        const id = req.params.id;
        const filter = {_id:new ObjectId(id)}
        const options = { upsert: true };
        const updateDoc = {
            $set: {
              role:'admin'
            },
          };
          const result = await usersCollection.updateOne(filter,updateDoc,options)
          res.send(result)
    })

    app.post('/category',async (req,res)=>{

        const category = req.body;
        const result = await categoryCollection.insertOne(category);
        res.send(result)


    })


    app.get('/users',async(req,res)=>{
        const query = {};
        
         const allUser = await usersCollection.find(query).toArray();
         res.send(allUser)
        
            })

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