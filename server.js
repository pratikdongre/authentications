const express = require('express');
const app = express();
const port = 4000;

app.use(express.json());

//  public route where no authentication required 

app.get('/',(req,res)=> {
    res.send('welcome to the api');
});


app.listen(port,()=>{
    console.log(`server is running at ${port}`);
});

// till this point we created a basic express server 


// now we are going to generate api key using crypto

const crypto = require('crypto');

const generateapikey = () =>{
    return crypto.randomBytes(32).toString('hex');
}

const validApiKey = generateapikey();
console.log(`your validapikey ${validApiKey}`);


// middleware function to authenticate api key for incoming requests 

const authenticateApiKey =  (req,res,next) =>{
    const apikey = req.headers['api-key'];

    if(apikey && apikey === validApiKey) {
        next();
    } else {
        res.status(403).json({message : "Access Denied : Invalid APi key"})
    }
};


app.get('/data',authenticateApiKey,(req,res)=>{
    res.json({message : "Access Granted to Protected data "})
});



