const express = require("express");
const dotenv = require("dotenv");
const methodOverride = require("method-override");
const bodyParser =  require ('body-parser');
const mongoose = require('mongoose');
const database = require("./config/database");
const systemConfig = require("./config/system"); 
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');

dotenv.config();

database.connect();

const routesAdmin = require("./routes/admin/index.route");
const routesClient = require("./routes/client/index.route");

const app = express();
const port = process.env.PORT;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(methodOverride('_method'));

app.set("views", `${__dirname}/views`); 
app.set("view engine", "pug");

app.use(express.static(`${__dirname}/public`));

//flash  
app.use(cookieParser('KJJSLASKSAKAM'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
//end flash

app.locals.prefix_Admin = systemConfig.prefix_Admin;

routesAdmin(app);

routesClient(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});