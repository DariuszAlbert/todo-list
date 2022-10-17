// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();

const todos = ["Make coffe", "Drink coffe"];

const workItems = ["Make coffe", "Drink coffe"];

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

app.get("/", function(req, res){
    const day = date.getDay();
    res.render('list', {listTitle: day, todos: todos});

});

app.post("/", function(req, res){

  const todo = req.body.todo;

  if (req.body.list === "Work"){
    workItems.push(todo);
    res.redirect("/work");
  }else {
    todos.push(todo);
    res.redirect("/");
  }

});

 app.get("/work", function(req, res){
   res.render("list", {listTitle: "Work list", todos: workItems});
 });

 app.post("/work", function(){
   const item = req.body.newItem;
   workItems.push(item);
   res.redirect("/work");
 })

 app.get("/about", function(req,res){
   res.render("about");
 });

app.listen(3000, () =>{
  console.log("Server listening on post 3000");

});
