var express = require("express");
var router = express.Router();

const uuid = require("uuid"); // uuid 모듈 추가
var UserRealm = require("../db/realm");
var account = require("../module/accountModule");

/* GET 계정 전체 조회 */
router.get("/", function (req, res, next) {
  const users = UserRealm.objects("User").sorted("date", true);

  res.send({
    success: true,
    data: users,
  });
});

/* POST 계정 추가. */
// todo: 이메일 중복체크
router.post("/", function (req, res, next) {
  console.log(req.body);
  console.log(req.body.email);

  var email = req.body.email;
  var password = req.body.password;
  var name = req.body.name;
  var tel = req.body.tel;

  console.log(`계정 데이터: ${email}`);

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

    res.status(201).send({
      success: true,
      message: "계정 추가 성공",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "계정 추가 실패",
    });
  }
});

/* DELETE 계정 삭제 */
router.delete("/:email", function (req, res, next) {
  const user = account.findUserByEmail(req.params.email);

  try {
    if (user) {
      UserRealm.write(() => {
        UserRealm.delete(user);
      });

      res.send({
        success: true,
        message: "계정 삭제 성공",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "계정 삭제 실패",
    });
  }
});

/* PUT 비밀번호 변경. */
router.put("/:email", function (req, res, next) {
  const user = account.findUserByEmail(req.params.email);
  const password = account.findPassword(user.password, req.body.inputPassword);

  try {
    if (user && password) {
      UserRealm.write(() => {
        user.password = req.body.newPassword;
      });

      res.status(200).send({
        success: true,
        message: "비밀번호 변경 성공",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "비밀번호 변경 실패",
    });
  }
});

/* POST 로그인 */
router.post("/login", function (req, res, next) {
  result = account(req, res, next);

  console.log("result: " + result);
  console.log("result.token: " + result.token);

  if (result) {
    res.status(200).send({
      success: true,
      message: "로그인 성공",
      data: result,
    });
  } else {
    res.status(500).send({
      success: false,
      message: "로그인 실패",
    });
  }
});

module.exports = router;
