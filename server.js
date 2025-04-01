// Here is where we import modules
const dotenv = require("dotenv"); // require package
dotenv.config(); // Loads the environment variables from .env
const express = require('express');
const mongoose = require("mongoose"); // require package
const methodOverride = require("method-override");
const morgan = require("morgan");

//Import the database model
const Terpene = require('./models/terpenes.js');
// define the app
const app = express();
//middlewares here
// middleware to let us use restful routing
app.use(methodOverride("_method"));
// middleware logging tool
app.use(morgan("dev"));

// RESTful Routes
// Landing page =Read
app.get("/", async (req, res) => {
    res.render("index.ejs");
  });
// List of all known terpenes = Read
app.get("/terpenes", async (req, res) => {
    const allterpenes = await Terpene.find();
    res.render("terpenes/index.ejs", { terpenes: allterpenes });
  });
// new discovery page form =Read
app.get("/terpenes/new", (req, res) => {
    res.render("terpenes/new.ejs");
  });
//post route= Create
app.post("/terpenes", async (req, res) => {
    try {
        const { name, science, aromatics, effects } = req.body;

        // Create a new Terpene document
        const newTerpene = new Terpene({
            name: name,
            aka: science,
            aromatics: Array.isArray(aromatics) ? aromatics : [aromatics],
            effects: Array.isArray(effects) ? effects : [effects],
            foundIn: Array.isArray(req.body.strains) ? req.body.strains : [req.body.strains],
        });

        // Save the new Terpene to the database
        await newTerpene.save();

        // Redirect to the list of terpenes
        res.redirect("/terpenes");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating new Terpene");
    }
});

 // Connect to MongoDB using the connection string in the .env file
 mongoose.connect(process.env.MONGODB_URI);
 // log connection status to terminal on start
 mongoose.connection.on("connected", () => {
     console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
   });
 
 
 //connection port
const port = process.env.PORT ||3001
 app.listen(port, () => {
   console.log('Listening on port ', port);
 });
 