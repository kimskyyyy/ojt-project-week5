const express = require("express");
const router = express.Router();

const multer = require("multer"); // multer 모듈: 파일 업로드를 위한 multipart/form-data 를 다루기 위한 node.js 의 미들웨어
const fs = require("fs"); // fs 모듈: 파일 시스템을 조작하는 다양한 메서드 제공
const path = require("path"); // path 모듈: 파일 및 디렉토리 경로 작업을 위한 다양한 메서드 제공

const session = require("../module/sessionModule"); // session 모듈
const response = require("../util/response"); // 공통 응답 모듈
var logging = require("../util/logger"); // 로그 모듈

//------------------------------ 파일 업로드 관련 설정------------------------------//

// 파일을 업로드할 uploads 폴더 생성
fs.readdir("uploads", (error) => {
  if (error) {
    logging.info("uploads 폴더가 없어 uploads 폴더를 생성합니다.");
    fs.mkdirSync("uploads");
  }
});

/*
파일 업로드 처리를 위해 multer 모듈 사용

multer.diskStorage: 파일 저장 방식을 정하는 옵션

destination: 파일이 저장될 경로를 정하는 옵션
  cb: 콜백함수로 전송된 파일을 저장할 폴더를 지정하는데 사용
  첫 번째 매개변수: 에러가 발생하면 해당 에러를 전달
  두 번째 매개변수: 실제 저장할 폴더를 지정

filename: 파일의 이름을 정하는 옵션
  cb: 콜백함수로 전송된 파일을 저장할 이름을 지정하는데 사용
  첫 번째 매개변수: 에러가 발생하면 해당 에러를 전달
  두 번째 매개변수: 파일의 이름을 지정
*/

const upload = multer({
  storage: multer.diskStorage({
    // 파일 저장 경로 설정
    destination(req, file, cb) {
      cb(null, "uploads/"); // cb 콜백 함수를 통해 전송된 파일 저장 디렉토리 설정, 'uploads/' 디렉토리로 지정
    },
    // 파일 저장명 설정
    filename(req, file, cb) {
      cb(null, file.originalname);
    },
  }),
  // 파일 최대 용량
  limits: { fileSize: 5 * 1024 * 1024 },
});

//------------------------------ api 요청 ------------------------------//

/* GET 파일 업로드 */

// 단일 파일 업로드 multer.single(fileName)
router.post("/upload", upload.single("file"), function (req, res, next) {
  logging.info("POST/ 파일 업로드 요청", { 요청정보: req.file });

  // 사용자 인증
  result = session(req, res, next);

  if (result) {
    logging.info("파일 업로드 요청", { user: result });
    logging.info("파일 정보", { file: req.file });
    const imagePath = req.file.path;
    if (imagePath === undefined) {
      return res.status(400).send(response.fail(400, "파일이 없습니다."));
    }
    res
      .status(200)
      .send(
        response.success(200, "파일 업로드 성공", `저장경로: /${imagePath}`)
      );
  }
});

// n개 파일 업로드 multer.array(, 개수제한)
router.post("/uploads", upload.array("files", 10), function (req, res, next) {
  logging.info(`POST/ 파일 다중 업로드 요청 : ${req.files}`);
  res
    .status(200)
    .send(
      response.success(200, "파일 업로드 성공", `파일개수: ${req.files.length}`)
    );
});

module.exports = router;
