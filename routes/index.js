const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Quote = mongoose.model("quotes");
const { ensureAuthenticated, ensureGuest } = require("../helpers/auth");

router.get("/", ensureGuest, (req, res) => {
  res.render("index/welcome");
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  Quote.find({ user: req.user.id }).then(quotes => {
    res.render("index/dashboard", {
      quotes: quotes
    });
  });
});

router.get("/about", (req, res) => {
  res.render("index/about");
});

module.exports = router;
