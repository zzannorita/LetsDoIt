const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const bcrypt = require("bcrypt");

const cors = require("cors");
router.use(
  cors({
    origin: true, // 모든 출처를 허용
    credentials: true, // credentials 모드를 사용할 경우 true로 설정
  })
);

const connection = require("../db");

connection.connect((error) => {
  if (error) {
    console.error("Error connecting to MySQL server(user): " + error.stack);
    return;
  }
  console.log("Connected to MySQL server as id(user) " + connection.threadId);
});

router.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
router.use(bodyParser.json({ limit: "50mb" }));

// 가입 라우트
router.post("/createUser", (req, res) => {
  const usercode = req.body.userCode;
  const password = req.body.password;
  console.log("받아온 usercode, password : ", usercode, password);
  const sendData = { code: "" };

  if (usercode && password) {
    connection.query(
      "SELECT * FROM user WHERE usercode = ?",
      [usercode],
      function (error, results, fields) {
        if (error) throw error;
        if (results.length <= 0) {
          const username = "user_" + usercode;
          connection.query(
            "INSERT INTO user (usercode, password, name) VALUES (?, ?, ?)",
            [usercode, password, username],
            function (error, data) {
              if (error) throw error;
              sendData.code = "PROCEED_WITH_NEW_SIGN-UP";
              res.send(sendData);
            }
          );
        } else {
          if (results[0].password == password) {
            console.log("코드와 패스워드가 일치함.");
            sendData.code = "USERDATA_MATCH";
            res.send(sendData);
          } else {
            console.log("코드와 패스워드가 불일치함.");
            sendData.code = "USERDATA_MISMATCH";
            res.send(sendData);
          }
        }
      }
    );
  } else {
    sendData.code = "USERCODE_PASSWORD_RE-ENTERING";
    res.send(sendData);
  }
});

//유저 이름 변경 라우트
router.post("/updateUser", (req, res) => {
  const newName = req.body.newName;
  const usercode = req.body.usercode;
  console.log("받아온 newName : ", newName);
  const sendData = { isSuccess: "" };
  if (newName) {
    connection.query(
      "UPDATE user SET name = ? WHERE usercode = ?",
      [newName, usercode],
      function (error, results, fields) {
        if (error) throw error;
        sendData.code = "update";
        res.send(sendData);
      }
    );
  } else {
    sendData.isSuccess = "변경할 이름을 다시 입력받기.";
    res.send(sendData);
  }
});

//유저 닉네임 검색 라우트
router.post("/searcUserName", (req, res) => {
  const usercode = req.body.userCode;
  console.log("받아온 usercode : ", usercode);
  const sendData = { isSuccess: "" };

  if (usercode) {
    connection.query(
      "SELECT name FROM user WHERE usercode = ?",
      [usercode],
      function (error, results, fields) {
        if (error) throw error;
        sendData.results = results;
        res.send(sendData);
      }
    );
  } else {
    sendData.isSuccess = "존재하지 않음.";
    res.send(sendData);
  }
});

module.exports = router;
