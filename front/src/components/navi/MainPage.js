import React, { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Board from "../component/Board";
import Calender from "../component/Calender";
import Gantt from "../component/Gantt";
import styles from "./Login.module.css";
import view from "../../img/view.png";
import expansion from "../../img/expansion.png";

const MainPage = () => {
  const navigate = useNavigate();
  const [viewPage, setViewPage] = useState(false);
  const [viewImage, setViewImage] = useState(view);

  const toggleView = () => {
    setViewPage(!viewPage);
    setViewImage(viewPage ? view : expansion);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setViewPage(false);
    setViewImage(view);
  };

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
              <div onClick={() => handleNavigation("/calendar")}>캘린더</div>
              <div onClick={() => handleNavigation("/gantt")}>간트차트</div>
              <div onClick={() => handleNavigation("/todo")}>할 일</div>
            </div>
            <div className={styles.viewImg}>
              <img src={viewImage} alt="view" onClick={toggleView}></img>
            </div>
          </div>
        </div>
      </div>
      <div>
        {viewPage ? (
          <div className={styles.viewPage}>
            <div className={styles.viewPageTop}>
              <Calender />
              <Gantt />
            </div>
            <div className={styles.viewPageBtm}>
              <Board />
            </div>
          </div>
        ) : (
          <Routes>
            <Route path="/calendar" element={<Calender />} />
            <Route path="/gantt" element={<Gantt />} />
            <Route path="/todo" element={<Board />} />
            <Route path="/" element={<Calender />} />
          </Routes>
        )}
      </div>
    </div>
  );
};

export default MainPage;
