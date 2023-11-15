var express = require("express");
var router = express.Router();
var account = require("../module/accountModule");

const response = require("../util/response");

/* POST 계정 인증 */
router.post("/", function (req, res, next) {
  result = account.account(req, res, next);

  console.log("result: " + result);
  console.log("result.token: " + result.token);

  if (result) {
    res.status(200).send(response.success(200, "인증 성공", result.token));
  } else {
    res.status(500).send(response.fail(500, "인증 실패"));
  }
});

module.exports = router;
