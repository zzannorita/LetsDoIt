import React, { useState } from "react";

import style from "./Calender.module.css";
import styles from "../navi/Login.module.css";
import left from "../../img/left.png";
import right from "../../img/right.png";
import search from "../../img/search.png";

const Calender = () => {
  const [value, onChange] = useState(new Date());

  return (
    <div className={style.container}>
      <div className={style.mainBox}>
        <div className={style.monthBox}>
          <div>
            <img className={style.img} src={left} alt="left"></img>
          </div>
          <div className={style.month}>5월</div>
          <div>
            <img className={style.img} src={right} alt="right"></img>
          </div>
        </div>
        <div className={style.topBox}>
          <div className={style.nameBox}>
            <span className={styles.highlight}>5811</span>님의 캘린더
          </div>
          <div className={style.selectBox}>
            <div className={style.colorBox}>
              <label className={`${style.checkbox_label} ${style.red}`}>
                <input type="checkbox" name="red" value="red"></input>
                <span className={style.checkbox_icon}></span>
              </label>
              <label className={`${style.checkbox_label} ${style.yellow}`}>
                <input type="checkbox" name="yellow" value="yellow"></input>
                <span className={style.checkbox_icon}></span>
              </label>
              <label className={`${style.checkbox_label} ${style.green}`}>
                <input type="checkbox" name="green" value="green"></input>
                <span className={style.checkbox_icon}></span>
              </label>
              <label className={`${style.checkbox_label} ${style.blue}`}>
                <input type="checkbox" name="blue" value="blue"></input>
                <span className={style.checkbox_icon}></span>
              </label>
              <label className={`${style.checkbox_label} ${style.purple}`}>
                <input type="checkbox" name="purple" value="purple"></input>
                <span className={style.checkbox_icon}></span>
              </label>
            </div>
            <div className={style.searchImg}>
              <img className={style.img} src={search} alt="search"></img>
            </div>
          </div>
        </div>
        {/* <div className={style.calendarBox}>
          <div className={style.day}>요일</div>
          <div className={style.box}>숫자</div>
        </div> */}
        <div className={style.textBox}>하단텍스트박스</div>
      </div>
    </div>
  );
};

export default Calender;
