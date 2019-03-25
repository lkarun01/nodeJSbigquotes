const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Quote = mongoose.model("quotes");
const User = mongoose.model("users");
const { ensureAuthenticated, ensureGuest } = require("../helpers/auth");

// Quotes Index
router.get("/", (req, res) => {
  Quote.find({
    status: "public"
  })
    .populate("user")
    .then(quotes => {
      res.render("quotes/index", {
        quotes: quotes
      });
    });
});

// Add story form
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("quotes/add");
});

// Process add quotes
router.post("/", ensureAuthenticated, (req, res) => {
  let allowComments;

  if (req.body.allowComments) {
    allowComments = true;
  } else {
    allowComments = false;
  }

  const newQuote = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComments: allowComments,
    user: req.user.id
  };

  // Create Story
  new Quote(newQuote).save().then(quote => {
    res.redirect(`/quotes/show/${quote.id}`);
  });
});

module.exports = router;
