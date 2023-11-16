const winston = require("winston");
const moment = require("moment-timezone");

moment.tz.setDefault("Asia/Seoul"); // 한국 시간으로 설정

const logger = winston.createLogger({
  // 출력 형식 정의
  transports: [
    new winston.transports.Console(), // 콘솔 출력: 개발 중 디버깅에 사용됨
    new winston.transports.File({ filename: "app.log" }), // 파일 출력: 실제 운영 환경에서 로그 관리
  ],
  // 로그 형식 지정
  format: winston.format.combine(
    // combine을 사용하여 여러 형식을 조합할 것을 배열로 정의
    winston.format.timestamp({
      format: moment().format("YYYY-MM-DD HH:mm:ss"), // 시간 형식 지정
    }), //  시간 출력
    winston.format.colorize(), // 색상 출력
    winston.format.json(), // JSON 형식으로 출력
    winston.format.simple() // ${info.level}: ${info.message} 형식으로 출력
  ),
});

module.exports = logger;
