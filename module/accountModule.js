var UserRealm = require("../db/realm");
const uuid = require("uuid"); // uuid 모듈 추가
var logging = require("../util/logger"); // 로그 모듈

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

function account(req, res, next) {
  logging.info("계정 인증 요청", { 요청정보: req.body });
  const user = findUserByEmail(req.body.email);
  const password = findPassword(user.password, req.body.inputPassword);

  try {
    if (user && password) {
      UserRealm.write(() => {
        const sessionToken = uuid.v4(); // uuid를 사용해서 세션 토큰 생성
        user.token = sessionToken; // 세션 토큰 저장
      });
      logging.info("계정 인증 성공", { user: user });
      return user;
    }
  } catch (error) {
    logging.error("사용자 인증 실패", error);
    return 0;
  }
}

module.exports = { account, findUserByEmail, findPassword };
