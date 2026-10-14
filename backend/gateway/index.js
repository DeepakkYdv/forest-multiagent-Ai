import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/',(req,res)=>{
    res.json({message:"hello from gateway!"})

})

app.listen(PORT,()=>{
    console.log(`gateway started at ${PORT}`)
})