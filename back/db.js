// db.js (MySQL 연결 설정 파일)

const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "manager",
  password: "1234",
  database: "todo",
});

module.exports = connection;
