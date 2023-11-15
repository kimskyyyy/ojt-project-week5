const express = require("express");
const router = express.Router();

const multer = require("multer"); // multer 모듈 추가
const fs = require("fs"); // fs 모듈 추가
const path = require("path"); // path 모듈 추가

const session = require("../module/sessionModule"); // session 모듈 추가

const response = require("../util/response");

// 파일을 업로드할 uploads 폴더 생성
fs.readdir("uploads", (error) => {
  if (error) {
    console.log("uploads 폴더를 생성합니다.");
    fs.mkdirSync("uploads");
  }
});
// 파일 업로드 설정
const upload = multer({
  storage: multer.diskStorage({
    // 파일 저장 경로 설정
    destination(req, file, cb) {
      // cb 콜백 함수를 통해 전송된 파일 저장 디렉토리 설정, 'uploads/' 디렉토리로 지정
      cb(null, "uploads/");
    },
    // 파일 저장명 설정
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      // cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext);
      // cb 콜백 함수를 통해 전송된 파일 이름 설정
      // cb(null, path.basename(file.originalname, ext));
      cb(null, file.originalname);
      console.log(file.originalname);
    },
  }),
  // 파일 최대 용량
  limits: { fileSize: 5 * 1024 * 1024 },
});

// api 요청 섹션 시작

/* GET 파일 업로드 */

// 단일 파일 업로드 multer.single(fileName)
router.post("/upload", upload.single("file"), function (req, res, next) {
  result = session(req, res, next);
  console.log(`result!!!! ${result}`);

  if (result) {
    console.log("단일 파일 업로드 요청");
    console.log(req.file);
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
/* POST users listing. */
router.post("/", upload.array("files", 10), function (req, res, next) {
  console.log(req.files);
  // res.json(`~~post 요청 응답~~`);
  res
    .status(200)
    .send(
      response.success(200, "파일 업로드 성공", `파일개수: ${req.files.length}`)
    );
});

/* GET 파일 다운로드 */
router.get("/upload", function (req, res, next) {
  res.send("GET 파일 다운로드");
});

module.exports = router;
