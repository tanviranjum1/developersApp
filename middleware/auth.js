//bring in json webtoken.
const jwt = require("jsonwebtoken");
// bring in config. we will need secret.
const config = require("config");

// since middleware function takes in three arguments
module.exports = function (req, res, next) {
  // when we send request to a protected route we need to send token in header.
  // get token from header.
  //header key specified.
  // Get token from header
  const token = req.header("x-auth-token");

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Verify available token
  try {
    // we decode the token.
    //takes in two things. token send in header.
    // also the secret.
    const decoded = jwt.verify(token, config.get("jwtSecret"));

    // take request object and assign to user.
    // set it the decoded object  which has user as payload.
    req.user = decoded.user;

    // now we can use req.user in any of our protected routes and get user's profile.
    // last thing in any middleware:
    next();
  } catch (err) {
    // if token but not valid.
    res.status(401).json({ msg: "Token is not valid" });
  }
};
