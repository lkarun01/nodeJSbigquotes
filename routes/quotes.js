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
    .sort({ date: "desc" })
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

// Show single quote
router.get("/show/:id", (req, res) => {
  Quote.findOne({
    _id: req.params.id
  })
    .populate("user")
    .populate("comments.commentUser")
    .then(quote => {
      if (quote.status == "public") {
        res.render("quotes/show", {
          quote: quote
        });
      } else {
        if (req.user) {
          if (req.user.id == quote.user._id) {
            //console.log(quote);
            res.render("quotes/show", {
              quote: quote
            });
          } else {
            res.redirect("/quotes");
          }
        } else {
          res.redirect("/quotes");
        }
      }
    });
});

// List quotes from a user
router.get("/user/:userId", (req, res) => {
  Quote.find({ user: req.params.userId, status: "public" })
    .populate("user")
    .then(quotes => {
      res.render("quotes/index", {
        quotes: quotes
      });
    });
});

// Logged in user quotes
router.get("/my", ensureAuthenticated, (req, res) => {
  Quote.find({ user: req.user.id })
    .populate("user")
    .then(quotes => {
      res.render("quotes/index", {
        quotes: quotes
      });
    });
});

// Edit single quote
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  Quote.findOne({
    _id: req.params.id
  }).then(quote => {
    if (quote.user != req.user.id) {
      res.redirect("/quotes");
    } else {
      res.render("quotes/edit", {
        quote: quote
      });
    }
  });
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

// Edit the Quote
router.put("/:id", (req, res) => {
  Quote.findOne({
    _id: req.params.id
  }).then(quote => {
    let allowComments;

    if (req.body.allowComments) {
      allowComments = true;
    } else {
      allowComments = false;
    }

    // New Values
    quote.title = req.body.title;
    quote.body = req.body.body;
    quote.status = req.body.status;
    quote.allowComments = allowComments;

    quote.save().then(quote => {
      res.redirect("/dashboard");
    });
  });
});

// Delete Quote
router.delete("/:id", (req, res) => {
  Quote.deleteOne({ _id: req.params.id }).then(() => {
    res.redirect("/dashboard");
  });
});

// add comments
router.post("/comment/:id", (req, res) => {
  Quote.findOne({
    _id: req.params.id
  }).then(quote => {
    const newComment = {
      commentBody: req.body.commnetBody,
      commentUser: req.user.id
    };

    // Add to comments array to the begining by using unshift()
    quote.comments.unshift(newComment);

    quote.save().then(quote => {
      res.redirect(`/quotes/show/${quote.id}`);
    });
  });
});

module.exports = router;
