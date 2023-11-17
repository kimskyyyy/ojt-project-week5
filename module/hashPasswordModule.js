var express = require("express");
var router = express.Router();

const logging = require("../util/logger"); // 로그 모듈
const bcrypt = require("bcrypt");

/*
  * bcrypt 비밀번호 암호화
  비밀번호를 암호화하는 두 가지 메서드
  hashSync(password, saltRounds): 동기적으로 비밀번호를 암호화(호출 시 현재 스레드가 block되어 작업 수행)
  hash(password, saltRounds, callback): 비동기적으로 비밀번호를 암호화(호출 시 현재 스레드가 block되지 않고 작업 수행)
*/
function hashPassword(password) {
  try {
    const hashPassword = bcrypt.hashSync(password, 10);
    return hashPassword;
  } catch (error) {
    console.log(error);
  }
}

/* 
  bcrypt 비밀번호 비교
  저장된 비밀번호와 입력된 비밀번호를 비교하는 메서드
  이 메서드 비동기적으로 동작하므로 await 또는 콜백을 사용하여 결과를 처리해야함 
*/
function comparePasswords(inputPassword, hashedPassword) {
  console.log("inputPassword", inputPassword);
  console.log("hashedPassword", hashedPassword);
  try {
    const result = bcrypt.compare(inputPassword, hashedPassword);
    return result;
  } catch (error) {
    logging.error("비밀번호 비교 실패", { error: error });
    throw error;
  }
}

module.exports = { hashPassword, comparePasswords };
