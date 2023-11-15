var UserRealm = require("../db/realm");

function session(req, res, next) {
  // 헤더에서 이메일과 토큰 추출
  const email = req.headers.email;
  const token = req.headers.token;

  if (!email || !token) {
    return res.status(401).send({ message: "이메일과 토큰을 넣어주세요." });
  }

  try {
    const user = UserRealm.objects("User").filtered(
      `email = "${email}" AND token = "${token}"`
    );

    if (user.length === 1) {
      // 사용자가 존재하고 토큰이 일치하면 인증 성공
      // 토큰 만료시간 갱신
      UserRealm.write(() => {
        user[0].tokenExp = new Date();
      });

      return 1;
    } else {
      // 사용자가 없거나 토큰이 일치하지 않으면 인증 실패
      return 0;
    }
  } catch (error) {
    console.log(error);
    return 0;
  }
}

// 토큰 만료시간 확인 코드 필요
module.exports = session;
