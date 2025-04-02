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
app.use(express.urlencoded({ extended: false }));

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
  console.log(req.body)
  res.render("terpenes/new.ejs");
});
//look at a single terpene page =Read
app.get('/terpenes/show/:terpeneId', async (req, res) => {
  const foundTerpene = await Terpene.findById(req.params.terpeneId);
  res.render('terpenes/show.ejs', { terpene: foundTerpene })
})
//post route= Create
app.post("/terpenes", async (req, res) => {
  try {
    const { name, science, aromatics, effects } = req.body;
    console.log(req.body)
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
// route to update a terpene with new information
app.get('/terpenes/update/:terpeneId', async (req, res) => {
  const foundTerpene = await Terpene.findById(req.params.terpeneId);
  res.render('terpenes/update.ejs', { terpene: foundTerpene })
})
//they click an update button, and it brings you to an update page
//then when they submit, it adds to the existing entry
app.put('/terpenes/update/:terpeneId', async (req, res) => {
  const { name, aka, foundIn, aromatics, effects } = req.body;
  console.log(req.body)


    const aromaticsArray = Array.isArray(aromatics) ? aromatics : [aromatics];
    const effectsArray = Array.isArray(effects) ? effects : [effects];

    console.log(aromaticsArray)
    console.log(effectsArray)

  try {
    await Terpene.findByIdAndUpdate(req.params.terpeneId,
      { // This is to set the new values into the database
        $set: {
          name: name,
          aka: aka,
          aromatics: aromaticsArray,
          effects: effectsArray,   
        }, // this is to push the info into an array (since foundIn is coming in as a string on your form)
        $push: {
          foundIn: req.body.foundIn, 
        }
      }, {new: true} )
      .then(updatedUser => {
        if (updatedUser) {
          console.log('User updated successfully:', updatedUser);
        } else {
          console.log('User not found');
        }
      })
      .catch(error => {
        console.error('Error updating user:', error);
      });
  }

  catch (err) {
    console.log(err)
  }
  // res.send('test')
  console.log("found the terpene", req.params.terpeneId)
  
  // console.log(foundTerpene)
  // res.send(foundTerpene)

// res.send("successfully updated the terpene")
  res.redirect(`/terpenes/show/${req.params.terpeneId}`)

});

// Connect to MongoDB using the connection string in the .env file
mongoose.connect(process.env.MONGODB_URI);
// log connection status to terminal on start
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});


//connection port
const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log('Listening on port ', port);
});
