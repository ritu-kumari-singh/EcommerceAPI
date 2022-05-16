const express = require("express");
const bodyParser = require("body-parser");
const db = require("./config/mongoose");

const port = 8000;

const app = express();

//Set the view engine
app.set("view engine", "ejs");

//Setting up middleware
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//Setting up routes
app.use("/", require("./routes"));
app.listen(port, function (err) {
  if (err) {
    console.log("Error in running server", err);
    return;
  }
  console.log(`Server running on port : ${port}`);
});
