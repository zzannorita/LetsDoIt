import React, { useState } from "react";
import logo from "../../img/logo.png";
import calendar from "../../img/calendar.png";
import styles from "./Login.module.css";

const Login = ({ onLogin }) => {
  const [userCode, setUserCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [receivedData, setReceivedData] = useState(); //input태그 상황별 값
  const [errorMessage, setErrorMessage] = useState("");

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
        if (data.code === "USERDATA_MATCH") {
          onLogin(userCode);
        } else if (data.code === "PROCEED_WITH_NEW_SIGN-UP") {
          setErrorMessage("회원가입이 완료되었습니다. 로그인을 해주세요.");
          setShowPasswordInput(false);
          setPassword("");
        } else {
          setErrorMessage(
            "비밀번호가 일치하지 않거나 이미 존재하는 코드입니다. 다시 입력해주세요."
          );
          setShowPasswordInput(false);
          setPassword("");
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
                    <span className={styles.highlight}>TIP</span>
                    {errorMessage
                      ? errorMessage
                      : " 처음이신가요? 새로운 코드(10자리 이내)를 입력해 주세요."}
                  </div>
                </>
              )}
            </div>
          </div>
          <div>
            <img src={calendar} alt="calendar" className={styles.imgBox}></img>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
