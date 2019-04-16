module.exports = {
  ensureAuthenticated: (req, res, next) => {
    //console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/");
  },
  ensureGuest: (req, res, next) => {
    if (req.isAuthenticated()) {
      res.redirect("/dashboard");
    } else {
      return next();
    }
  }
};
