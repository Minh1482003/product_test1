const express = require("express");
const dotenv = require("dotenv");
const mongoose = require('mongoose');
const database = require("./config/database");
const systemConfig = require("./config/system"); 

dotenv.config();

database.connect();

const routesAdmin = require("./routes/admin/index.route");
const routesClient = require("./routes/client/index.route");

const app = express();
const port = process.env.PORT;

app.set("views", "./views"); 
app.set("view engine", "pug");

app.use(express.static('public'));

app.locals.prefixAdmin = systemConfig.prefix_Admin;

routesAdmin(app);

routesClient(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});