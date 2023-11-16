var express = require("express");
var router = express.Router();

var UserRealm = require("../db/realm");
var account = require("../module/accountModule");
var logging = require("../util/logger"); // 로그 모듈
const response = require("../util/response");

/* GET 계정 전체 조회 */
router.get("/", function (req, res, next) {
  logging.info("GET: 계정 전체 조회");
  const users = UserRealm.objects("User").sorted("date", true);

  res.send({
    success: true,
    data: users,
  });
});

/* POST 계정 추가. */
// todo: 이메일 중복체크
router.post("/", function (req, res, next) {
  logging.info("POST: 계정 추가", { body: req.body });

  var email = req.body.email;
  var password = req.body.password;
  var name = req.body.name;
  var tel = req.body.tel;

  try {
    UserRealm.write(() => {
      UserRealm.create("User", {
        email: email,
        password: password,
        name: name,
        tel: tel,
        toeken: "default",
        date: new Date(),
        tokenExp: new Date(),
      });
    });

    res.status(201).send(response.success(201, "계정 추가 성공"));
  } catch (error) {
    logging.error("계정 추가 실패", { error: error });
    res.status(500).send(response.fail(500, "계정 추가 실패"));
  }
});

/* DELETE 계정 삭제 */
router.delete("/:email", function (req, res, next) {
  logging.info("DELETE: 계정 삭제", { email: req.params.email });
  const user = account.findUserByEmail(req.params.email);

  try {
    if (user) {
      UserRealm.write(() => {
        UserRealm.delete(user);
      });

      res.send(response.success(200, "계정 삭제 성공"));
    }
  } catch (error) {
    logging.error("계정 삭제 실패", { error: error });
    res.status(500).send(response.fail(500, "계정 삭제 실패"));
  }
});

/* PUT 비밀번호 변경. */
router.put("/:email", function (req, res, next) {
  logging.info("PUT: 비밀번호 변경", { email: req.params.email });
  const user = account.findUserByEmail(req.params.email);
  const password = account.findPassword(user.password, req.body.inputPassword);

  try {
    if (user && password) {
      UserRealm.write(() => {
        user.password = req.body.newPassword;
      });

      res.status(200).send(rsponse.true(200, "비밀번호 변경 성공"));
    }
  } catch (error) {
    logging.error("비밀번호 변경 실패", { error: error });
    res.status(500).send(response.fail(500, "비밀번호 변경 실패"));
  }
});

/* POST 로그인 */
router.post("/login", function (req, res, next) {
  logging.info("로그인 요청", { email: req.body.email });
  result = account.account(req, res, next);

  if (result) {
    res.status(200).send(response.success(200, "로그인 성공", result.token));
  } else {
    res.status(500).send(response.fail(500, "로그인 실패"));
  }
});

module.exports = router;
