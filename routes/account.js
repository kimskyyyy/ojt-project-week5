var express = require("express");
var router = express.Router();
var account = require("../module/accountModule");

const response = require("../util/response"); // 공통 응답 모듈
var logging = require("../util/logger"); // 로그 모듈

/* POST 계정 인증 */
router.post("/", function (req, res, next) {
  logging.info("계정 인증 요청", { 요청정보: req.body });

  result = account.account(req, res, next);

  if (result) {
    res.status(200).send(response.success(200, "인증 성공", result.token));
  } else {
    res.status(500).send(response.fail(500, "인증 실패"));
  }
});

module.exports = router;
