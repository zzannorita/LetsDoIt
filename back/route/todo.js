const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();

const cors = require("cors");

router.use(
  cors({
    origin: true,
    credentials: true,
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
  const usercode = req.body.userCode;
  const start = req.body.start;
  const end = req.body.end;
  const title = req.body.title;
  const content = req.body.content;
  let color;
  if (req.body.color) {
    color = req.body.color;
  } else {
    color = "#ccc";
  }
  console.log(start, end);

  if (usercode) {
    connection.query(
      "INSERT INTO todo (usercode, start, end, title, content, color) VALUES (?, ?, ?, ?, ?, ?)",
      [usercode, start, end, title, content, color],
      function (error, results, fields) {
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
  const color = req.body.color;

  if (usercode) {
    connection.query(
      "UPDATE todo SET title = ?, start = ?, end = ?, content = ?, color = ? WHERE boardId = ?",
      [title, start, end, content, color, boardId],
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

//스케줄 상태 변경 라우트
router.post("/updateStateSchedule", (req, res) => {
  const sendData = {};

  const state = req.body.state;
  const boardId = req.body.boardId;
  const usercode = req.body.usercode;

  if (usercode) {
    connection.query(
      "UPDATE todo SET state = ? WHERE boardId = ?",
      [state, boardId],
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
      "DELETE FROM todo WHERE boardId = ?",
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
