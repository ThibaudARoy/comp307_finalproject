const passport = require("passport");

function isAuthenticated() {
  return passport.authenticate("jwt", { session: false });
}

module.exports = {
  isAuthenticated,
};
