var UserRealm = require("../db/realm");
const uuid = require("uuid"); // uuid 모듈 추가
const logging = require("../util/logger"); // 로그 모듈
const bcrypt = require("../module/hashPasswordModule"); // 비밀번호 암호화 모듈

//------------------------------ 공통 메서드------------------------------//

// 이메일 기반 계정 조회
function findUserByEmail(email) {
  return UserRealm.objects("User").filtered(`email = "${email}"`)[0];
}

// 이메일 기반 비밀번호 조회
function findPassword(password, inputPassword) {
  return password === inputPassword;
}

//------------------------------ 계정 관련 메서드------------------------------//

async function account(req, res, next) {
  logging.info("계정 인증 요청", { 요청정보: req.body });
  const user = findUserByEmail(req.body.email);

  console.log("user.password", user.password);
  console.log("req.body.inputPassword", req.body.inputPassword);

  try {
    const passwordMatch = await bcrypt.comparePasswords(
      req.body.inputPassword, // 입력된 비밀번호
      user.password // 해시된 비밀번호
    );

    console.log(passwordMatch);

    if (user && passwordMatch) {
      const sessionToken = uuid.v4(); // uuid를 사용해서 세션 토큰 생성
      // 토큰 만료시간 설정
      const tokenExp = new Date();
      tokenExp.setDate(tokenExp.getDate() + 30);
      UserRealm.write(() => {
        user.token = sessionToken; // 세션 토큰 저장
        user.tokenExp = tokenExp; // 토큰 만료시간 저장
      });
      logging.info("계정 인증 성공", { user: user });
      return user;
    } else {
      logging.error("계정 인증 실패", { user: user });
      return 0;
    }
  } catch (error) {
    logging.error("사용자 인증 실패", error);
    return 0;
  }
}

module.exports = { account, findUserByEmail, findPassword };
