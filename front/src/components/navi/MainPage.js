import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Board from "../component/Board";
import Calender from "../component/Calender";
import Gantt from "../component/Gantt";
import styles from "./Login.module.css";
import logo from "../../img/logo.png";
import view from "../../img/view.png";

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.logoBox}>
          <div className={styles.logo}>
            해보자<span className={styles.highlight}>G</span>O
            <span className={styles.highlight}>!</span>
          </div>
        </div>
        <div className={styles.headerBox}>
          <div className={styles.naviBox}>
            <div className={styles.naviInnerBox}>
              <div onClick={() => navigate("/calendar")}>캘린더</div>
              <div onClick={() => navigate("/gantt")}>간트차트</div>
              <div onClick={() => navigate("/todo")}>할 일</div>
            </div>
            <div className={styles.viewImg}>
              <img src={view} alt="view"></img>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Routes>
          <Route path="/calendar" element={<Calender />} />
          <Route path="/gantt" element={<Gantt />} />
          <Route path="/todo" element={<Board />} />
          <Route path="/" element={<Calender />} />
        </Routes>
      </div>
    </div>
  );
};

export default MainPage;
