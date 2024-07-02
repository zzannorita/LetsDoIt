const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

const user = require("./route/user");
const todo = require("./route/todo");

app.use("/user", user);
app.use("/todo", todo);

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));

// db mysql 관련
const connection = require("./db");
connection.connect((error) => {
  if (error) {
    console.error("Error connecting to MySQL server(server): " + error.stack);
    return;
  }
  console.log("Connected to MySQL server as id(server) " + connection.threadId);
});

//3001 번 포트 제대로 연결시 콘솔에 running 출력
app.listen(3001, () => {
  console.log("3001 port running");
});
