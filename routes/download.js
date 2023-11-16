var express = require("express");
var router = express.Router(); // router 객체는 express.Router()로 만듦

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const session = require("../module/sessionModule"); // session 모듈
const response = require("../util/response"); // 공통 응답 모듈

//------------------------------ api 요청 ------------------------------//

/* GET users listing. */
router.get("/download/:fileName", function (req, res, next) {
  // 사용자 인증
  result = session(req, res, next);

  if (result) {
    const fileName = req.params.fileName;
    const filePath = `uploads/${fileName}`;

    console.log(`fileName: ${fileName}`);
    console.log(`filePath: ${filePath}`);
    const ch = fs.existsSync(filePath);
    console.log(`파일 존재여부: ${ch}`);

    // 다운로드 요청한 파일이 존재하는지 확인
    if (fs.existsSync(filePath)) {
      // 파일의 MIME 유형 설정(이미지, pdf, txt 등)
      res.setHeader("Content-Type", getMimeType(fileName));

      // 파일의 Content-Disposition 헤더를 "inline"으로 설정하여 파일을 브라우저에서 바로 보기
      res.setHeader("Content-Disposition", "inline; filename=" + fileName);

      // 파일 스트림을 응답에 연결
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } else {
      res.status(404).send(response.fail(404, "파일이 존재하지 않습니다."));
    }
  }
});

//------------------------------ 메서드 ------------------------------//

// 파일 유형을 확인하고 MIME 유형을 반환해주는 메서드
function getMimeType(fileName) {
  const extname = path.extname(fileName);
  switch (extname.toLowerCase()) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".pdf":
      return "application/pdf";
    case ".txt":
      return "text/plain";
    default:
      return "application/octet-stream";
  }
}

module.exports = router; // 라운터를 모듈로 만듦
