const express = require('express');
const app = express();
const port = 4000;

app.use(express.json());

const crypto = require('crypto');

const generateapikey = () =>{
        return crypto.randomBytes(32).toString('hex');
    }

    

const users = {};

app.post('/create-user',(req,res)=>{
    const username = req.body.username;
    
    if(!username){
        return res.status(400).json({ message : 'username is required'});
    }

    if(users[username]){
        return res.status(400).json({message : "user already exist"})
    }

    

    const apikey = generateapikey();
    console.log(`your validapikey ${apikey}`);

    users[username] = {apikey};

    res.json({ message : `user created`, username , apikey});


});





//  public route where no authentication required 

app.get('/',(req,res)=> {
    res.send('welcome to the api');
});


app.listen(port,()=>{
    console.log(`server is running at ${port}`);
});

// till this point we created a basic express server 


// now we are going to generate api key using crypto



// middleware function to authenticate api key for incoming requests 

const authenticateApiKey =  (req,res,next) =>{
    const apikey = req.headers['api-key'];

    if(!apikey)
    {
        return res.status(403).json({message :"no api key provided"});
    }

    // if(apikey && apikey === validApiKey) {
    //     next();
    // } else {
    //     res.status(403).json({message : "Access Denied : Invalid APi key"})
    // }

    const user = Object.keys(users).find(username => users[username].apikey === apikey);

    if (users){
        req.user = user;
        next();
    } else {
        return res.status(403).json({ message : 'Invalid Api Key'});
    }
};


app.get('/data',authenticateApiKey,(req,res)=>{
    res.json({message : "Access Granted to Protected data "})
});



