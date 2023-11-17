var express = require("express");
var router = express.Router();

var UserRealm = require("../db/realm");
var account = require("../module/accountModule");
var logging = require("../util/logger"); // 로그 모듈
const response = require("../util/response");
const bcrypt = require("../module/hashPasswordModule"); // 비밀번호 암호화 모듈
const session = require("../module/sessionModule"); // session 모듈

/* GET 계정 전체 조회 */
router.get("/", function (req, res, next) {
  logging.info("GET/ 계정 전체 조회");
  const users = UserRealm.objects("User").sorted("date", true);

  res.send({
    success: true,
    data: users,
  });
});

/* POST 계정 추가. */
router.post("/", function (req, res, next) {
  logging.info("POST/ 계정 추가", { body: req.body });

  var email = req.body.email;
  var password = bcrypt.hashPassword(req.body.password); // 해시된 비밀번호를 저장
  var name = req.body.name;
  var tel = req.body.tel;

  try {
    // 이메일 중복체크
    const existUser = account.findUserByEmail(email);
    if (existUser) {
      logging.error("이메일 중복", { email: email });
      res.status(409).send(response.fail(409, "이메일 중복")); // 409: Conflict
    } else {
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
    }
  } catch (error) {
    logging.error("계정 추가 실패", { error: error });
    console.log(error);
    res.status(500).send(response.fail(500, "계정 추가 실패"));
  }
});

/* DELETE 계정 삭제 */
router.delete("/:email", function (req, res, next) {
  logging.info("DELETE/ 계정 삭제", { email: req.params.email });
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
/*
기존 로직
쿼리스트링으로 이메일을 받고, 바디에는 현재 비밀번호와 새로운 비밀번호를 받는다.
이메일로 계정을 조회하고, 조회된 계정의 비밀번호와 바디에 입력된 현재 비밀번호를 비교한다.
비밀번호가 일치하면 새로운 비밀번호로 변경한다.


수정 로직
쿼리스트링으로 이메일을 받고, 헤더에 이메일과 토큰을 받고, 바디에는 수정할 비밀번호를 받는다.
세션 모듈로 사용자 인증을 한다.
사용자 인증이 성공하면 입력된 수정할 비밀번호로 변경한다.

*/
router.put("/:email", function (req, res, next) {
  logging.info("PUT/ 비밀번호 변경 요청", { email: req.params.email });

  // 사용자 인증
  const result = session(req, res, next);

  const user = account.findUserByEmail(req.params.email);

  try {
    if (result) {
      UserRealm.write(() => {
        user.password = bcrypt.hashPassword(req.body.newPassword); // 해시된 비밀번호를 저장
      });

      res.status(200).send(response.success(200, "비밀번호 변경 성공"));
    } else {
      res
        .status(500)
        .send(
          response.fail(500, "비밀번호 변경 실패, 비밀번호를 확인해주세요")
        );
    }
  } catch (error) {
    logging.error("비밀번호 변경 실패", { error: error });
    console.log(error);
    res.status(500).send(response.fail(500, "비밀번호 변경 실패"));
  }
});

/* POST 로그인 */
router.post("/login", async function (req, res, next) {
  logging.info("POST/ 로그인 요청", { email: req.body });

  try {
    // 계정 인증
    const result = await account.account(req, res, next);
    if (result) {
      res.status(200).send(response.success(200, "로그인 성공", result.token));
    } else {
      res.status(500).send(response.fail(500, "로그인 실패"));
    }
  } catch (error) {
    logging.error("로그인 실패", { error: error });
  }
});

module.exports = router;
