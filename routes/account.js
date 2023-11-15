var express = require("express");
var router = express.Router();
var account = require("../module/accountModule");

/* POST 계정 인증 */
router.post("/", function (req, res, next) {
  // result = JSON.parse(account(req, res, next));
  result = account(req, res, next);

  console.log("result: " + result);
  console.log("result.token: " + result.token);

  if (result) {
    res.status(200).send({
      success: true,
      message: "인증 성공",
      data: result.token,
    });
  } else {
    res.status(500).send({
      success: false,
      message: "인증 실패",
    });
  }
});

module.exports = router;
