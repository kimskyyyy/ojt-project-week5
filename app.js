var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser"); // 쿠키를 파싱하고 사용하기 위한 미들웨어
var logger = require("morgan"); // HTTP 요청에 대한 로그를 출력하는 미들웨어
var logging = require("./util/logger"); // 로그 모듈

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var uploadsRouter = require("./routes/upload"); // 파일 업로드를 위한 라우터 추가
var downloadsRouter = require("./routes/download"); // 파일 다운로드를 위한 라우터 추가
var accountRouter = require("./routes/account"); // 계정 관리를 위한 라우터 추가
var tokenRouter = require("./routes/token"); // 토큰 관리를 위한 라우터 추가

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev")); // 미들웨어 morgan을 사용하여 로그를 출력하는 설정, dev: 개발용, combined: 배포용
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/files", uploadsRouter); // 파일 업로드를 위한 라우터 추가
app.use("/api/files", downloadsRouter); // 파일 다운로드를 위한 라우터 추가
app.use("/api/token", tokenRouter); // 토큰 관리를 위한 라우터 추가
app.use("/api/account", accountRouter); // 계정 관리를 위한 라우터 추가

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
