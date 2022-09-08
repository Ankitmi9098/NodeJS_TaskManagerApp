const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api2", {
  useNewUrlParser: true,
  // useCreateIndex: true
});
















//User Model was defined here

// const me = new User({
//   name: "andrew",
//   email: "Myemail@example.com",
//   age: 34,
//   password:"   aldafwm;;asf"
// });

// me.save()
//   .then(() => {
//     console.log(me);
//   })
//   .catch(() => {
//     console.log("errror!!!!" + Error);
//   });


//Task model was defined here
// const myTask = new Task({
//   description: "Task App",
//   completed: true,
// });

// myTask
//   .save()
//   .then(() => {
//     console.log(myTask);
//   })
//   .catch(() => {
//     console.log("Error");
//   });
