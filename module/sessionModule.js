var UserRealm = require("../db/realm");
var logging = require("../util/logger"); // 로그 모듈

function session(req, res, next) {
  logging.info("사용자 인증 요청");

  // 헤더에서 이메일과 토큰 추출
  const email = req.headers.email;
  const token = req.headers.token;

  if (!email || !token) {
    logging.error("이메일과 토큰을 확인해주세요.");
    res.status(401).send({ message: "이메일과 토큰을 확인해주세요." });
    return 0;
  }

  try {
    // 이메일 && 토큰이 true인 사용자 찾기
    const user = UserRealm.objects("User").filtered(
      `email = "${email}" AND token = "${token}"`
    )[0];

    if (user && new Date() > user.tokenExp) {
      logging.error("토큰 만료");
      return 0;
    } else {
      logging.info("사용자 인증 성공", { user: user });
      // 토큰 만료시간
      const tokenExp = new Date();
      tokenExp.setDate(tokenExp.getDate() + 30);

      // realm에 토큰 만료시간 갱신
      UserRealm.write(() => {
        user.tokenExp = tokenExp;
      });
      return user;
    }
  } catch (error) {
    logging.error("사용자 인증 실패", error);
    return 0;
  }
}

module.exports = session;
