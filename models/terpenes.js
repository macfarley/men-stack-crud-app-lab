// models/terpenes.js

const mongoose = require("mongoose");

const terpeneSchema = new mongoose.Schema({
    name: String,
    aromatics: [],
    effects: [],
    foundIn: []
  });

const Terpene = mongoose.model("Terpene", terpeneSchema); // create model
// The model is created using the schema we defined above

//export the model so we can use it in other files
// This allows us to interact with the terpenes collection in our MongoDB database
// We can perform CRUD operations using this model
// For example, we can create new terpenes, read existing terpenes, update them, or delete them.
module.exports = Terpene;
