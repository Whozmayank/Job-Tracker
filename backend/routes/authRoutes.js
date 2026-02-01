const express = require("express");
const { login, register } = require("../controllers/auth.js");

const router = express.Router();

router.post("/register", register); //register route
router.post("/login", login); //login route
router.get("/test", (req, res) => {
  res.send("Auth route working" );
});

module.exports = router;
