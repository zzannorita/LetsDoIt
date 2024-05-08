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

connection.connect((error) => {
  if (error) {
    console.error("Error connecting to MySQL server(todo): " + error.stack);
    return;
  }
  console.log("Connected to MySQL server as id(todo) " + connection.threadId);
});

router.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
router.use(bodyParser.json({ limit: "50mb" }));

module.exports = router;
