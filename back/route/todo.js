const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();

const cors = require("cors");

router.use(
  cors({
    origin: true, // 모든 출처를 허용
    credentials: true, // credentials 모드를 사용할 경우 true로 설정
  })
);

const connection = require("../db");
const e = require("express");

connection.connect((error) => {
  if (error) {
    console.error("Error connecting to MySQL server(todo): " + error.stack);
    return;
  }
  console.log("Connected to MySQL server as id(todo) " + connection.threadId);
});

router.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
router.use(bodyParser.json({ limit: "50mb" }));

//스케줄 검색 라우트
router.post("/searchSchedule", (req, res) => {
  const sendData = {};

  const usercode = parseInt(req.body.userCode, 10);
  console.log(usercode);

  if (usercode) {
    // user코드 받아온 경우 즉 로그인이 된 어떤 상태.
    connection.query(
      "SELECT * FROM todo WHERE usercode = ?",
      [usercode],
      function (error, results, fields) {
        if (error) {
          sendData.code = "ERROR";
          sendData.message = "Database query error";
          res.send(sendData);
        } else {
          sendData.code = "SUCCESS";
          sendData.results = results;
          res.send(sendData);
        }
      }
    );
  } else {
    sendData.code = "NO_USER_INFORMATION";
    res.send(sendData);
  }
});

//스케줄 추가 라우트
router.post("/addSchedule", (req, res) => {
  const sendData = {};

  //프론트 실험 가능할 때 수정 필수 !!!!!!!!!

  const usercode = req.body.userCode;
  const start = req.body.start;
  const end = req.body.end;
  const title = req.body.title;
  const content = req.body.content;
  console.log(start, end);

  if (usercode) {
    // user코드 받아온 경우 즉 로그인이 된 어떤 상태.
    connection.query(
      "INSERT INTO todo (usercode, start, end, title, content) VALUES (?, ?, ?, ?, ?)",
      [usercode, start, end, title, content],
      function (error, results, fields) {
        //results에 삽입 작업에 대한 정보가 들어간다.
        //영향을 받은 행의 수 => insert의 경우엔 1임,
        //새로 삽입된 행의 고유 ID => 이 값은 테이블의 'auto_increment 필드에 대해 설정된 ID를 반환함.,
        //변경된 행의수 => insert는 일반적으로 0임.
        if (error) throw error;
        sendData.code = "DATA_TRANSFER_SUCCESSFUL";
        res.send(sendData);
      }
    );
  } else {
    sendData.code = "NO_USER_INFORMATION";
    res.send(sendData);
  }
});

//스케줄 변경 라우트
router.post("/updateSchedule", (req, res) => {
  const sendData = {};

  const usercode = req.body.userCode;
  const boardId = req.body.boardId;
  const start = req.body.start;
  const end = req.body.end;
  const title = req.body.title;
  const content = req.body.content;

  if (usercode) {
    connection.query(
      "UPDATE todo SET title = ?, start = ?, end = ?, content = ? WHERE boardId = ?",
      [start, end, title, content],
      function (error, results, fields) {
        if (error) throw error;
        sendData.code = "DATA_UPDATE_SUCCESSFUL";
        res.send(sendData);
      }
    );
  } else {
    sendData.code = "NO_USER_INFORMATION";
    res.send(sendData);
  }
});

//스케줄 삭제 라우트
router.post("/deleteSchedule", (req, res) => {
  const sendData = {};
  const usercode = req.body.userCode;
  const boardId = req.body.boardId;
  if (usercode) {
    connection.query(
      "DELETE FROM todo WHERE id = ?",
      [boardId],
      function (error, results, fields) {
        if (error) throw error;
        sendData.code = "DATE_DELETE_SUCCESSFUL";
        res.send(sendData);
      }
    );
  } else {
    sendData.code = "NO_USER_INFORMATION";
    res.send(sendData);
  }
});

module.exports = router;
