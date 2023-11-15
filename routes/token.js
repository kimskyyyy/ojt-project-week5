var express = require("express");
var router = express.Router();
var session = require("../module/sessionModule");

/* GET 토큰 인증 */
router.get("/", function (req, res, next) {
  session(req, res, next);
});

module.exports = router;
