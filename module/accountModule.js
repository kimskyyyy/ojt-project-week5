var UserRealm = require("../db/realm");
const uuid = require("uuid"); // uuid 모듈 추가

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
  const user = findUserByEmail(req.body.email);
  console.log(JSON.stringify(user));
  const password = findPassword(user.password, req.body.inputPassword);
  console.log(`user확인: ${user}`);
  console.log(`password확인: ${password}`);

  try {
    if (user && password) {
      UserRealm.write(() => {
        const sessionToken = uuid.v4(); // uuid를 사용해서 세션 토큰 생성
        user.token = sessionToken; // 세션 토큰 저장
      });
      console.log(JSON.stringify(user));
      console.log(`user.token 찍어보기: ${user.token}`);
      return user;
    }
  } catch (error) {
    console.log(error);
    return 0;
  }
}

module.exports = { account, findUserByEmail, findPassword };
