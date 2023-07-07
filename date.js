
// creating a node export module
// console.log(module);  //to print to this module objects
// module.exports="Hello World"
module.exports.getDate=function(){
var today=new Date() ; //create a new date object

var options={
    weekday:"long",
    day:"numeric",
    month:"long"
}
return today.toLocaleDateString('en-US',options); // Get the full weekday name

}

//creating particular export for a particular function
module.exports.getDay= function() {
    var today=new Date() ; //create a new date object
    
    var options={
        weekday:"long",
       
    }
    return today.toLocaleDateString('en-US',options); // Get the full weekday name
    
    }