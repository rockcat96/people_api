//Dependencies
require("dotenv").config();
const {PORT = 3000, DATABASE_URL} = process.env //achieving the same result as const PORT = process.env.PORT || 3000;
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors")
const morgan = require("morgan")


const app = express()

mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

mongoose.connection
  .on("open", () => console.log("Your are connected to mongoose"))
  .on("close", () => console.log("Your are disconnected from mongoose"))
  .on("error", (error) => console.log(error));

const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String,
})

const People = mongoose.model("People", PeopleSchema)

//middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());


//Routes

//test route
app.get("/", (req, res) => {
    res.send("hello world")
})

//index route
app.get("/people", async (req,res) => {
    try{
        res.json(await People.find({}))
    }catch(error){
        res.status(400).json(error)
    }
});



//create route
app.post("/people", async(req, res) => {
    try {
        res.json(await People.create(req.body))
    } catch (error) {
        res.status(400).json(error)
    }
})

//update route
app.put("/people/:id", async (req, res) => {
    try{
        res.json(
            await People.findByIdAndUpdate(req.params.id, req.body, {new: true})
        )
    }catch(error){
        res.status(400).json(error)
    }
})

//delete route
app.delete("/people/:id", async(req,res) => {
    try{
        res.json(await People.findByIdAndRemove(req.params.id))
    }catch(error){
        res.status(400).json(error)
    }
})

//find people by id 
app.get("/people/:id", async(req, res) => {
    try{
        res.json(await People.findById(req.params.id))
    }catch(error){
        res.status(400).json(error)
    }
})


//listener
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`))