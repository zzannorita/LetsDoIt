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
  //요기 밑에 name은 코드랑 password 받고 캘린더 있는 메인페이지에서 닉네임
  //수정하기 등을 통해서 수정할 예정임!!!!!!!!!!!
  //const name = req.body.name
  const sendData = { code: "" };

  if (usercode && password) {
    // 유저코드와 패스워드를 입력 받았다면 !!! 만약 아무것도 입력되지 않으면 에러처리 -> 맨 밑의 같은 들여쓰기 else문에 처리코드 있어욤
    connection.query(
      // 쿼리문을 연결된 DB로 전송하는것임...!
      "SELECT * FROM user WHERE usercode = ?", //db user테이블 내에 user코드 입력받은것이 존재 한다면 다 검색해줘.
      [usercode],
      function (error, results, fields) {
        // 여기서 검색 받아온 데이터들이 results에 다 존재하게 됨!!
        console.log("검색해서 받아온 값 ->", results.password);
        if (error) throw error;
        if (results.length <= 0) {
          // results 갯수가 0개 이하라면, 즉 db에 값이 없다는 얘기죠? 그럼 회원 정보를 만들어야게찌
          const username = "user_" + usercode; // 기본 유저 닉네임을 user_usercode로 설정
          connection.query(
            "INSERT INTO user (usercode, password, name) VALUES (?, ?, ?)", // 테이블에 값을 삽입하는 SQL문 ?에 [] 안의 변수값들이 들어가욤
            [usercode, password, username],
            function (error, data) {
              if (error) throw error;
              sendData.code = "PROCEED_WITH_NEW_SIGN-UP";
              res.send(sendData);
            }
          );
        } else {
          if (results[0].password == password) {
            //db내 패스워드와 입력받은 패스워드가 일치하면 로그인
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
  console.log("받아온 newName : ", newName);
  const sendData = { isSuccess: "" };

  if (newName) {
    connection.query(
      // 쿼리문을 연결된 DB로 전송하는것임...!
      "UPDATE user SET name = ? WHERE usercode = ?", //db user테이블 내에 user코드 입력받은것이 존재 한다면 다 검색해줘.
      [newName, usercode],
      function (error, results, fields) {
        if (error) throw error;
        //업데이트의 경우 results는 반환된 행의 개수를 가지고있다고 함.
      }
    );
  } else {
    sendData.isSuccess = "변경할 이름을 다시 입력받기.";
    res.send(sendData);
  }
});

module.exports = router;
