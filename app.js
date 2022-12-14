const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//mongodb connection
mongoose.connect("mongodb://localhost:27017/todolistDB");

// Schema
const itemsSchema = {
  name: String
};

// Model
const Item = mongoose.model("Item", itemsSchema);

// Create new documents
const item1 = new Item ({
  name: "Welcome to your todolist!"
});

const item2 = new Item ({
  name: "Hit the + button to add a new item"
});

const item3 = new Item ({
  name: "<-- Hit this to delete an item"
});

const defaultItems = [item1, item2, item3];


// Adding new Items
app.get("/", function(req, res) {
  const day = date.getDate();

  Item.find({}, function(err, foundItems){

    if(foundItems.length === 0){

      // Inserting default items
      Item.insertMany(defaultItems, function(err){
        if(err){
          console.log(err);
        }
        else{
          // mongoose.connection.close();
          console.log("Succesfully saved default items to DB");
        }
      });
      res.redirect('/');
    }else{
      res.render("list", {listTitle: day, newListItems: foundItems});
    }
  });
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  });
  item.save();
  res.redirect('/');
});

  // Deleting the item
app.post("/delete", function(req, res){
  const checkedItemId = (req.body.checkbox);


  Item.findByIdAndRemove(checkedItemId, function(err){
    if(!err){
      console.log("Successfully deleted the checked item");
      res.redirect('/');
    }
  });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
