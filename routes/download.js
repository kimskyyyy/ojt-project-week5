var express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const createHttpError = require("http-errors");
// const response = require("../util/response");

var router = express.Router(); // router 객체는 express.Router()로 만듦

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

/* GET users listing. */
router.get("/download/:fileName", function (req, res, next) {
  const fileName = req.params.fileName;
  //   const filePath = path.join(__dirname, "uploads", fileName);
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

    // res.status(200).send(response.success(200), "파일 다운로드 성공");

    // 파일 스트림을 응답에 연결
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } else {
    // res.status(404).send(response.fail(404, "파일이 존재하지 않습니다."));
    res
      .status(404)
      .send({ success: false, message: "파일이 존재하지 않습니다." });
  }
});

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
