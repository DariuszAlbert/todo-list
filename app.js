// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemSchema = {
  name: String
};

const listSchema = {
  name: String,
  items: [itemSchema]
};

const Item = new mongoose.model("Item", itemSchema);
const List = new mongoose.model("List", listSchema);


const item1 = new Item({
  name: "Make Coffee"
});

const item2 = new Item({
  name: "Drink Coffee"
});

const item3 = new Item({
  name: "Start working"
});

const defaultItems = [item1, item2, item3];

app.get("/", function(req, res){

    Item.find(function(err, foundItems){
      if (foundItems.length === 0){
        Item.insertMany(defaultItems, function(err){
          if (err){
            console.log(err);
          }else {};
          console.log("Base items inserted");
        });
        res.redirect("/");
      }else {
        res.render('list', {listTitle: date.getDay(), todos: foundItems});
      };
    });
});

app.post("/", function(req, res){
  const  todo = req.body.todo;
  const listName = req.body.list;

  const item = new Item({
    name: todo
  });
  if (listName === date.getDay()){
    item.save();
    res.redirect("/")
  }else {
    List.findOne({name: listName}, function(err, foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;
  const listName= req.body.listName;

if (listName === date.getDay()){
  Item.findByIdAndRemove(checkedItemId, function(err){
    if (err){
      console.log(err);
    }else{
      res.redirect("/");
    };
  });
}else{
  List.findOneAndUpdate(
    {name: listName},
    {$pull: {items: {_id: checkedItemId}}},
  function(err, foundList){
    if (!err){
      res.redirect("/" + listName);
    }
  });
}
});

app.get("/:customListName", function(req, res){
  const customListName = _.capitalize(req.params.customListName);
  List.findOne({name: customListName}, function(err, foundList){
    if (!err){
      if (!foundList){
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customListName);
      }else{
        res.render("list", {listTitle: foundList.name, todos: foundList.items });
      }
    }
  });

});

 app.get("/about", function(req,res){
   res.render("about");
 });

app.listen(3000, () =>{
  console.log("Server listening on post 3000");

});
