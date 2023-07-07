const express = require("express");
const bodyParser=require("body-parser")
const mongoose=require("mongoose");
const _ = require("lodash")
const app=express()
const date = require(__dirname+"/date.js")

// console.log(date); // prints hello world as only that is exported
// console.log(date());

app.use(bodyParser.urlencoded({extended:true}));


app.set('view engine', 'ejs'); // tells app to use ejs and view engine will go to look for the file you want to render
app.use(express.static("public"))


// let workItems=[];
// var items=["Buy Food","Cook Food","Eat Food"] now we are gonna store in our database

mongoose.connect("mongodb+srv://adithor:y0PtMfYkAKxijWlO@cluster0.j2uprpu.mongodb.net/ToDoListDB",{ useNewUrlParser: true, useUnifiedTopology: true })

// schema
const itemSchema={
    name:String
}
// mongoose model

const Item = mongoose.model("task",itemSchema)

// mongoose document

     const item1=new Item({
        name:"Welcome to your toDoList"
     })


     const item2=new Item({
        name:"Hit the + button to add a new item"
     })

     const item3=new Item({
        name:"<-- Hit this to delete an item"
     })
    

     const defaultItems=[item1,item2,item3]

  
const listSchema={
    name:String,
    items:[itemSchema]
}
const List=mongoose.model("List",listSchema)


    
app.get("/",function(req,res){
    
Item.find({})
.then(function(foundItem){
    if(foundItem.length===0){
          //  to inset all

    Item.insertMany(defaultItems)
    .then(function(){
        console.log("Successfully added the items");
    })
    .catch(function(err){
        console.log(err);
    });
    // nothing to render
    res.redirect("/")
    }
    
    else
    // let day=date.getDate()
    res.render("list",{listTitle:"Today",newListItems: foundItem}) //this will again give error as item is defined in app.post only so scope comes to picture
    // console.log(foundItem)

})
// .catch(function(err){
// console.log(err)
//     })
    
    



    // <!-- we need to create to html template where we can change parts of html depending on the logic in our server
    // It is useful when we are creating a website which has very similar content to each other -->
    // Here it is needed as if for each day we need a today list then there will be 7 conditional statement 
    // ejs comes to into play
})


app.get('/:customListName', async (req, res) => {
    try {
      const requestedTitle = _.capitalize(req.params.customListName);
    
      // Exclude 'favicon.ico' request
          if (requestedTitle === 'Favicon.ico') {
      // Handle favicon.ico request here
      // For example:
      res.status(204).end(); // Send a 'No Content' response
      return; // Exit the handler
    }
    
      const foundList = await List.findOne({ name: requestedTitle });
    
      if (!foundList) {
        const list = new List({
          name: requestedTitle,
          items: defaultItems
        });
    
        await list.save();
    
        res.redirect(`/${requestedTitle}`);
      } else {
        res.render("list", { listTitle: foundList.name, newListItems: foundList.items });
      }
    } catch (error) {
      // Handle any errors that occurred during database operations
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });
 

    
      


app.post("/delete",function(req,res){
    var checkeditem=req.body.checkbox;
    var listTitle=req.body.listTitle;
    if(listTitle==="Today"){
        Item.findByIdAndRemove(checkeditem)
        .then(function(){
            console.log("Succesfully deleted the checked item")
        })
        .catch(function(err){
            console.log(err)
        })
        res.redirect("/")
    }
    else{
        List.findOneAndUpdate({name:listTitle},{$pull:{items:{_id:checkeditem}}})
        .then(function(foundList){
            res.redirect("/"+listTitle);
        })
        .catch(function(err){
            console.log(err)
        })
    }
 
})







// when the post request recieved it gets caught in the below section and we tap into the request section looking through the body of the post request 
// and we search for value for something called newitem which matches with the name of the input

app.post("/",function(req,res){

    const itemName=req.body.newItem;
    const listName=req.body.list;
 
    const item = new Item({
        name: itemName, 
     })

    if(listName==="Today"){
        item.save();
        res.redirect("/")
    }
    else{
        List.findOne({name: listName})
        .then(function(foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+listName)

        })
    }

 
})




















app.listen(3000,function(){
    console.log("server is running on the port 3000")
})


// var except in function is a global variable even though declared inside curly braces whereas let and const remain local variable