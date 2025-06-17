const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;
const DATA_PATH = path.join(__dirname,"data","users.json");

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{res.send("API is running!");});

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});