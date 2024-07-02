import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Board from "../component/Board";
import Calender from "../component/Calender";
import Gantt from "../component/Gantt";
import styles from "./Login.module.css";
import view from "../../img/view.png";
import expansion from "../../img/expansion.png";

const MainPage = ({ userCode, onLogout }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [viewPage, setViewPage] = useState(false);
  const [viewImage, setViewImage] = useState(view);
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("activeTab") || "calender"
  );

  const toggleView = () => {
    setViewPage(!viewPage);
    setViewImage(viewPage ? view : expansion);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    localStorage.setItem("activeTab", tab);
  };

  useEffect(() => {
    if (userCode === "" || userCode === null || userCode === undefined) {
      navigate("/");
    }
  }, [userCode, navigate]);

  useEffect(() => {
    fetch("/user/searcUserName", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userCode: userCode }),
    })
      .then((response) => response.json())
      .then((data) => {
        setUsername(data.results[0].name);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [userCode]);

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
              <div onClick={() => handleTabClick("calender")}>캘린더</div>
              <div onClick={() => handleTabClick("gantt")}>간트차트</div>
              <div onClick={() => handleTabClick("todo")}>할 일</div>
            </div>
            <div className={styles.rightBox}>
              <button className={styles.logout} onClick={onLogout}>
                로그아웃
              </button>
              <div className={styles.viewImg}>
                <img src={viewImage} alt="view" onClick={toggleView}></img>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        {viewPage ? (
          <div className={styles.viewPage}>
            <div className={styles.viewPageTop}>
              <Calender userCode={userCode} username={username} />
              <Gantt userCode={userCode} username={username} />
            </div>
          </div>
        ) : (
          <>
            {activeTab === "calender" && (
              <Calender userCode={userCode} username={username}></Calender>
            )}
            {activeTab === "gantt" && (
              <Gantt userCode={userCode} username={username}></Gantt>
            )}
            {activeTab === "todo" && (
              <Board userCode={userCode} username={username}></Board>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MainPage;
