import React, { useState, useEffect } from "react";
import style from "./Calender.module.css";
import styles from "../navi/Login.module.css";
import left from "../../img/left.png";
import right from "../../img/right.png";
import search from "../../img/search.png";
import Modal from "./Modal";

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
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [events, setEvents] = useState({});
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isSearchBoxClick, setIsSearchBoxClick] = useState(false);
  const [isTipBoxClick, setIsTipBoxClick] = useState(false);

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
    // setDisplayDate(`${yy}년 ${mm + 1}월 ${dd}일`); //디스플레이 날짜
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
    setSelectedDate(selectedDate); // 선택된 날짜 저장
    setSelectedEvent(null);
    setModalOpen(true);
    // console.log("날짜모달");
  };

  //이벤트 모달 오픈 함수
  const handleEventClick = (event, e) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setSelectedDate(event.selectedDate);
    setEventModalOpen(true);
    // console.log("이벤트모달");
  };

  //저장 핸들러
  const handleSaveEvent = (eventData) => {
    setEvents((prevEvents) => {
      const updatedEvents = { ...prevEvents };
      const dateEvents = updatedEvents[eventData.selectedDate] || [];
      const eventIndex = dateEvents.findIndex(
        (event) => event.id === eventData.id
      );

      if (eventIndex >= 0) {
        // 기존 이벤트 업데이트
        dateEvents[eventIndex] = eventData;
      } else {
        // 새로운 이벤트 추가
        dateEvents.push(eventData);
      }

      updatedEvents[eventData.selectedDate] = dateEvents;
      return updatedEvents;
    });
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
              {["#eeaaaa", "#efe2a1", "#c4e6ce", "#add0fb", "#cbb1ed"].map(
                (color) => (
                  <label
                    key={color}
                    className={`${style.checkbox_label} ${style.customColor}`}
                    style={{ backgroundColor: color }}
                  >
                    <input type="checkbox" name="color" value={color} />
                    <span className={style.checkbox_icon}></span>
                  </label>
                )
              )}
            </div>
            <div className={style.searchImg}>
              <img
                className={style.img}
                src={search}
                alt="search"
                onClick={() => setIsSearchBoxClick(!isSearchBoxClick)}
              ></img>
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
                    <div className={style.dateTextBox}>
                      {(
                        events[
                          `${year}-${(month + 1)
                            .toString()
                            .padStart(2, "0")}-${val
                            .toString()
                            .padStart(2, "0")}`
                        ] || []
                      ).map((event, index) => (
                        <div
                          key={index}
                          className={style.dateText}
                          style={{ backgroundColor: event.selectedColor }}
                          onClick={(e) => handleEventClick(event, e)}
                        >
                          {event.modalName}
                        </div>
                      ))}
                    </div>
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
      </div>
      <div className={style.topTipBox}>
        <div
          className={styles.tipBox}
          onClick={() => setIsTipBoxClick(!isTipBoxClick)}
        >
          <span className={styles.highlight}>TIP </span>
          이름을 변경하시려면 여기를 클릭하세요!
        </div>
      </div>
      {isTipBoxClick && (
        <div className={style.tipTextBox}>
          <input
            className={style.inputTipText}
            type="text"
            placeholder="이름을 입력해 주세요."
          />
          <button className={style.okButton}>확인</button>
        </div>
      )}
      {isSearchBoxClick && (
        <div className={style.searchBox}>
          <div className={style.searchInputBox}>
            <input
              className={style.searchInput}
              type="text"
              placeholder="검색어를 입력하세요."
            />
          </div>
          <div className={style.searchResultBox}>
            <div className={style.searchResultName}>짱유디생일</div>
            <div className={style.searchResultDate}>2024-05-18</div>
          </div>
          <div className={style.searchResultBox}>
            <div className={style.searchResultName}>짱유디생일</div>
            <div className={style.searchResultDate}>2024-05-18</div>
          </div>
        </div>
      )}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedDate={selectedDate}
        onSave={handleSaveEvent}
      />
      {selectedEvent && (
        <Modal
          isOpen={eventModalOpen}
          onClose={() => setEventModalOpen(false)}
          selectedDate={selectedDate}
          selectedEvent={selectedEvent}
          onSave={handleSaveEvent}
          // event={selectedEvent}
        />
      )}
    </div>
  );
};

export default Calender;
