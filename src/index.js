const express = require("express");
const dotenv = require("dotenv");
const userRouter = require("./routers/userRouter");
const taskRouter = require("./routers/taskRouter");

//Setting express server
const app = express();
dotenv.config({ path: "src/configurations/config.env" });
require("./db/mongoose");
const port = process.env.PORT;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("Server is up and running on port " + port);
});
