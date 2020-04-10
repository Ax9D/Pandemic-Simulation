const express=require('express');


const app=express();
const port=8080;


app.get('/',(req,res)=>{
    
});


app.use(express.static(''));
app.listen(port,()=>{console.log("Started server on port"+port)});