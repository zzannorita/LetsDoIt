import React, { useState } from "react";

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
    <div>
      <div>처음 화면이 될 것</div>
      <div> db 테스트용 input</div>
      <div>
        <input
          type="text"
          value={usercode}
          onChange={handleUsercodeChange}
          placeholder="유저 코드를 입력하세요"
        />
        <input
          type="text"
          value={password}
          onChange={handlePasswordChange}
          placeholder="패스워드를 입력하세요"
        />
      </div>
      <button onClick={handleSubmit}>click</button>
      <div>{usercode}</div>
    </div>
  );
};

export default Login;
