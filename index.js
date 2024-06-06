//Backend for Bank app


//create a server application using express

//1.import express
const express=require('express');
//4.import cors
const cors=require('cors');

//import logic
const logic=require('./services/logic')

//2.create a server application using express
const server = express();

//5.use cors
server.use(cors({
    origin:'http://localhost:4200'
}))

//6
server.use(express.json())//return middleware that only parse json

//3.setup port for server application
server.listen(5000,()=>{
    console.log('server listening on port 5000');
})

//import jsonweb token
const jwt = require('jsonwebtoken')



//API Call to resolve - localhost:5000

//server.get('/',(req,res)=>{
//   res.send('welcome to backend')
//})
//server.post('/',(req,res)=>{
//    console.log('server post');
//})

//for sample
//Application - level Middleware

// const appMiddleware = (req,res,next)=>{
//     console.log('Application - level Middleware')
//     next();
// }

// server.use(appMiddleware)


//Router -level middleware

const jwtMiddleware = (req, res, next)=>{
    console.log('Router -level middleware')
    try{
        const token = req.headers['verify-token']
        console.log(token);
        const data = jwt.verify(token,'superkey2023')
        console.log(data);
        req.currentAcno=data.loginAcno
        next();
    }
    catch{
        res.status(401).json({message:"please Login"})
    }
}

//API CALLS
//Register - localhost:5000/register
server.post('/register',(req,res)=>{
    console.log('Inside register API call');
    console.log(req.body);
    //logic to resolve register request

    //import logic first then
    logic.register(req.body.username,req.body.acno,req.body.password).then((response)=>{
        res.status(response.statusCode).json(response)
    })
})



//Login - localhost:5000/login

server.post('/login', (req, res)=>{
    console.log('Inside login API Call');
    console.log(req.body);
    //logic to resolve login request

    logic.login(req.body.acno,req.body.password).then((response)=>{
        res.status(response.statusCode).json(response)
    })
})

//Balance - localhost:5000/balance
server.get('/getbalance/:acno',jwtMiddleware, (req, res)=>{
    console.log('Inside login API Call');
    console.log(req.params);//http://localhost:5000/getbalance/12
    logic.getBalance(req.params.acno).then((response)=>{
        res.status(response.statusCode).json(response)
    })
})

//Fund transfer - localhost:5000/fund transfer
server.post('/fundtransfer',jwtMiddleware, (req, res)=>{
    console.log('Inside fund transfer API Call');
    console.log(req.body);
    logic.fundTransfer(req.currentAcno,req.body.password,req.body.toAcno,req.body.amount).then
    ((response)=>{
        res.status(response.statusCode).json(response)
    })

    })
//transaction - localhost:5000/transactions

server.get('/transactions',jwtMiddleware,(req, res)=>{
    console.log('Inside transaction API Call');
    logic.transactionHistory(req.currentAcno).then((response)=>{
        res.status(response.statusCode).json(response)
    })
})

//DELETE Account

server.delete('/deleteAccount',jwtMiddleware,(req,res)=>{
    console.log('Inside the delete API Request');
    logic.deleteAccount(req.currentAcno).then((response)=>{
        res.status(response.statusCode).json(response)
    })
})
