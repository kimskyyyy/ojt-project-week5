const Realm = require("realm");

// User 스키마(모델) 정의
let UserSchema = {
  name: "User",
  properties: {
    email: "string",
    password: "string",
    name: "string",
    tel: "string",
    token: "string?", // 속성을 선택사항으로 변경하려면 '?'를 붙임
    date: "date",
    tokenExp: "date",
  },
  primaryKey: "email",
};

// Realm 객체 생성
let UserRealm = new Realm({
  path: "user.realm",
  schema: [UserSchema],
  //   schemaVersion: 1,
});

// Realm 객체 내보내기
module.exports = UserRealm;
