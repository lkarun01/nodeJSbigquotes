const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");

// Load User Model
require("./models/User");

// Load Quote Model
require("./models/Quote");

// Passport config
require("./config/passport")(passport);

// Load Routes
const auth = require("./routes/auth");
const index = require("./routes/index");
const quotes = require("./routes/quotes");

// Load keys
const keys = require("./config/keys");

// Mongoose connect
mongoose
  .connect(keys.mongoURI, { useNewUrlParser: true })
  .then(() => {
    console.log("Mongo DB connected");
  })
  .catch(err => {
    console.log(err);
  });

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Handlebars Middleware
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

app.use(cookieParser());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global vars
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Use Routes
app.use("/auth", auth);
app.use("/", index);
app.use("/quotes", quotes);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on por ${port}`);
});
