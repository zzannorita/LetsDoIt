import React, { useState } from "react";
import logo from "../../img/logo.png";
import calendar from "../../img/calendar.png";
import styles from "./Login.module.css";

const Login = ({ onLogin }) => {
  const [userCode, setUserCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [receivedData, setReceivedData] = useState(); //input태그 상황별 값

  const handleUserCodeChange = (event) => {
    setUserCode(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleUserCodeEnter = (event) => {
    if (event.key === "Enter") {
      setShowPasswordInput(true);
    }
  };

  const handlePasswordEnter = (event) => {
    if (event.key === "Enter") {
      console.log("실행됨..");
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const userData = {
      userCode: userCode,
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
        console.log(data.code);
        console.log(data);
        // setReceivedData(data.code);
        if (data.code === "USERDATA_MATCH") {
          console.log("로그인 성공", receivedData);
          onLogin(userCode);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.logoBox}>
          <div className={styles.logo}>
            해보자<span className={styles.highlight}>G</span>O
            <span className={styles.highlight}>!</span>
          </div>
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
              {showPasswordInput ? (
                <>
                  <input
                    className={styles.userCode}
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    onKeyDown={handlePasswordEnter}
                    placeholder="비밀번호를 입력하세요"
                  />
                  <div className={styles.tipBox}>
                    <span className={styles.highlight}>TIP</span> 비밀번호
                    4자리를 입력해주세요.
                  </div>
                </>
              ) : (
                <>
                  <input
                    className={styles.userCode}
                    type="text"
                    value={userCode}
                    onChange={handleUserCodeChange}
                    onKeyDown={handleUserCodeEnter}
                    placeholder="코드를 입력하세요."
                  />
                  <div className={styles.tipBox}>
                    <span className={styles.highlight}>TIP</span> 처음이신가요?
                    새로운 코드(10자리 이내)를 입력해 주세요.
                  </div>
                </>
              )}
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
