var express = require("express");
var router = express.Router();

var session = require("../module/sessionModule");
const response = require("../util/response");

/* GET 토큰 인증 */
router.get("/", function (req, res, next) {
  console.log("토큰 인증 요청");

  result = session(req, res, next);
  console.log(`result!!!! ${result}`);

  if (result) {
    res.status(200).send(response.success(200, "토큰 인증 성공", result.token));
  } else {
    res.status(500).send(response.fail(500, "토큰 인증 실패"));
  }
});

module.exports = router;
