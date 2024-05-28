import React, { useState } from "react";
import logo from "../../img/logo.png";
import calendar from "../../img/calendar.png";
import styles from "./Login.module.css";

const Login = () => {
  const [usercode, setUserCode] = useState("");
  const [password, serPassword] = useState("");

  const handleUsercodeChange = (event) => {
    setUserCode(event.target.value);
  };

  const handlePasswordChange = (event) => {
    serPassword(event.target.value);
  };

  const handleSubmit = () => {
    const userData = {
      usercode: usercode,
      password: password,
    };

    fetch("/user/createUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerBox}>
        <div className={styles.logoBox}>
          <img src={logo} alt="logo" width="200px" height="74px"></img>
        </div>
      </div>
      <div className={styles.mainBox}>
        <div className={styles.mainDiv}>
          <div className={styles.leftBox}>
            <div className={styles.textBox}>
              <div>
                오늘 <span className={styles.highlight}>할</span> 일을
                정리해보세요!
              </div>
              <div>
                일상 속 작은 변화로 큰 편의를. 심플하고 효율적인 일정 관리
                서비스
              </div>
            </div>
            <div className={styles.inputBox}>
              <input
                className={styles.userCode}
                type="text"
                value={usercode}
                onChange={handleUsercodeChange}
                placeholder="코드를 입력하세요."
              />
              {/* <input
                className={styles.pwd}
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="패스워드를 입력하세요"
              />
              <button onClick={handleSubmit}>click</button>
              <div>{usercode}</div> */}
              <div className={styles.tipBox}>
                <span className={styles.highlight}>TIP</span> 처음이신가요?
                새로운 코드(10자리 이내)를 입력해 주세요.{" "}
              </div>
            </div>
          </div>
          <div className={styles.rightBox}>
            <img
              src={calendar}
              alt="calendar"
              width="350px"
              height="350px"
            ></img>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
