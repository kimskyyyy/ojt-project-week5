const winston = require("winston");

const logger = winston.createLogger({
  // 출력 형식 정의
  transports: [
    new winston.transports.Console(), // 콘솔 출력: 개발 중 디버깅에 사용됨
    new winston.transports.File({ filename: "app.log" }), // 파일 출력: 실제 운영 환경에서 로그 관리
  ],
  // 로그 형식 지정
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.metadata({ fillExcept: ["level", "message", "timestamp"] }),
    winston.format.json(),
    winston.format.simple()
  ),
});

module.exports = logger;
