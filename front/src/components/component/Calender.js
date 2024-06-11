import React, { useState, useEffect } from "react";

import style from "./Calender.module.css";
import styles from "../navi/Login.module.css";
import left from "../../img/left.png";
import right from "../../img/right.png";
import search from "../../img/search.png";

const DAY_LIST = ["일", "월", "화", "수", "목", "금", "토"];
const MONTH_LIST = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
];

const Calender = () => {
  const [newDate, setNewDate] = useState(new Date()); //현재 날짜 상태 저장
  const [today, setToday] = useState(new Date());
  const [year, setYear] = useState(0); //현재 연도 상태 저장
  const [month, setMonth] = useState(0); //현재 월 상태 저장
  const [date, setDate] = useState(0); //현재 일 상태 저장
  const [lastDate, setLastDate] = useState(0); //현재 월의 마지막 일
  const [lastDatePrev, setLastDatePrev] = useState(0); //이전 월의 마지막 일
  const [firstDay, setFirstDay] = useState(0); //현재 월의 첫 번째 날의 요일
  const [displayDate, setDisplayDate] = useState(""); //디스플레이 날짜 상태 저장
  // const [openSelect, setOpenSelect] = useState(false);

  //newDate가 변경될 때마다
  useEffect(() => {
    const yy = newDate.getFullYear();
    const mm = newDate.getMonth();
    const dd = newDate.getDate();

    setYear(yy);
    setMonth(mm);
    setDate(dd);

    setLastDate(new Date(yy, mm + 1, 0).getDate()); //현재 월의 마지막 일 계산
    setLastDatePrev(new Date(yy, mm, 0).getDate()); //이전 월의 마지막 일 계산
    setFirstDay(new Date(yy, mm, 1).getDay()); //현재 월의 첫 번쨰 날의 요일 계산
    setDisplayDate(`${yy}년 ${mm + 1}월 ${dd}일`); //디스플레이 날짜
  }, [newDate]);

  //오늘 날짜
  useEffect(() => {
    setToday(new Date());
  }, []);

  //날짜 배열
  const handleDateArr = (target, lastDate, lastDatePrev, firstDay) => {
    let res = [];

    const r = (lastDate + firstDay) % 7; // remainder
    const prev = firstDay; // 이전 달 표기 일수
    const next = r === 0 ? 0 : 7 - r; // 다음 달 표기 일수

    //이전 달 날짜 배열
    if (target === "prev") {
      res = Array.from({ length: prev }, (_, i) => lastDatePrev - i).sort(
        (a, b) => a - b
      );
      //현재 달 날짜 배열
    } else if (target === "cur") {
      res = Array.from({ length: lastDate }, (_, i) => i + 1);
      //다음 달 날짜 배열
    } else if (target === "next") {
      res = Array.from({ length: next }, (_, i) => i + 1);
    }

    return res;
  };

  //월, 연도 변경 함수
  const handleChange = (type, target) => {
    if (type === "prev") {
      target === "month"
        ? setNewDate(new Date(year, month - 1, 1))
        : setNewDate(new Date(year - 1, month, 1));
    } else {
      target === "month"
        ? setNewDate(new Date(year, month + 1, 1))
        : setNewDate(new Date(year + 1, month, 1));
    }
  };

  //날짜 지정 함수
  const handleSelect = (target) => {
    const mm = (month + 1).toString().padStart(2, "0"); // 월을 두 자리로 포맷
    const dd = target.toString().padStart(2, "0"); // 일을 두 자리로 포맷
    const selectedDate = `${year}-${mm}-${dd}`; // 선택한 날짜 문자열 생성
  };

  return (
    <div className={style.container}>
      <div className={style.mainBox}>
        <div className={style.monthBox}>
          <div>
            <img
              className={style.img}
              src={left}
              alt="left"
              onClick={() => handleChange("prev", "month")}
            ></img>
          </div>
          <div className={style.month}>{MONTH_LIST[month]}월</div>
          <div>
            <img
              className={style.img}
              src={right}
              alt="right"
              onClick={() => handleChange("next", "month")}
            ></img>
          </div>
        </div>
        <div className={style.topBox}>
          <div className={style.nameBox}>
            <span className={styles.highlight}>5811</span>님의 캘린더
          </div>
          {/* 체크박스 */}
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
        {/* 달력 */}
        <div className={style.calendarBox}>
          <div className={style.calendarInnerBox}>
            <div className={style.dayList}>
              {DAY_LIST.map((day) => (
                <div
                  key={day}
                  className={`${style.dayItem} ${
                    day === "토" ? style.saturday : ""
                  } ${day === "일" ? style.sunday : ""}`}
                >
                  {day}
                </div>
              ))}
            </div>
            <div className={style.dateList}>
              {handleDateArr("prev", lastDate, lastDatePrev, firstDay).map(
                (val) => (
                  <div
                    key={`prev-${val}`}
                    className={style.prevDate}
                    onClick={() => handleChange("prev", "month")}
                  >
                    {val}
                  </div>
                )
              )}
              {handleDateArr("cur", lastDate, lastDatePrev, firstDay).map(
                (val) => (
                  <div
                    key={`current-${val}`}
                    className={`${style.curDate} ${
                      year === today.getFullYear() &&
                      month === today.getMonth() &&
                      val === today.getDate()
                        ? style.today
                        : ""
                    }`}
                    onClick={() => handleSelect(val)}
                  >
                    {val}
                    <div className={style.dateTextBox}></div>
                  </div>
                )
              )}
              {handleDateArr("next", lastDate, lastDatePrev, firstDay).map(
                (val) => (
                  <div
                    key={`next-${val}`}
                    className={style.nextDate}
                    onClick={() => handleChange("next", "month")}
                  >
                    {val}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
        <div className={style.textBox}>하단텍스트박스</div>
      </div>
    </div>
  );
};

export default Calender;
