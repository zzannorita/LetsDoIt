import React, { useState, useEffect } from "react";
import style from "./Calender.module.css";
import styles from "../navi/Login.module.css";
import left from "../../img/left2.png";
import right from "../../img/right2.png";
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

const Calender = ({ userCode, username }) => {
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
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [events, setEvents] = useState({});
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isSearchBoxClick, setIsSearchBoxClick] = useState(false);
  const [isTipBoxClick, setIsTipBoxClick] = useState(false);
  const [receivedData, setReceivedData] = useState({ results: [] });
  const [sendData, setSendData] = useState({ userCode: userCode });
  const [selectedColor, setSelectedColor] = useState("#ccc"); // 검색용 컬러
  const [newName, setNewName] = useState("");

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
    const mm = (month + 1).toString().padStart(2, "0");
    const dd = target.toString().padStart(2, "0");
    const selectedDate = `${year}-${mm}-${dd}`;
    const selectedEndDate = `${year}-${mm}-${dd}`;
    setSelectedDate(selectedDate);
    setSelectedEndDate(selectedEndDate);
    setSelectedEvent(null);
    setModalOpen(true);
  };

  //이벤트 모달 오픈 함수
  const handleEventClick = (event, e) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setSelectedDate(event.selectedDate);
    setSelectedEndDate(event.selectedEndDate);
    setEventModalOpen(true);
  };

  //이벤트 모달 오픈 함수2 검색했을때용
  const handleEventClick2 = (item, e) => {};

  //체크박스 중복 방지
  const checkOnlyOne = (checkThis) => {
    const checkBoxes = document.getElementsByName("color");
    let isChecked = checkThis.checked;

    for (let i = 0; i < checkBoxes.length; i++) {
      if (checkBoxes[i] !== checkThis) {
        checkBoxes[i].checked = false;
      }
    }

    if (isChecked) {
      setSelectedColor(checkThis.value);
    } else {
      setSelectedColor("#ccc");
    }
  };

  //날짜 포매팅 함수
  const formatDate2 = (date) => {
    const padZero = (num) => (num < 10 ? `0${num}` : num);

    const year = date.getFullYear();
    const month = padZero(date.getMonth() + 1);
    const day = padZero(date.getDate());
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    const seconds = padZero(date.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  //저장 핸들러
  const handleSaveEvent = (eventData) => {
    //이벤트 데이터를 이벤트 목록에 상태 업데이트
    setEvents((prevEvents) => {
      const updatedEvents = { ...prevEvents }; //기존 events 객체 복사
      const dateEvents = updatedEvents[eventData.selectedDate] || [];
      const eventIndex = dateEvents.findIndex(
        //이벤트 아이디들 중에 해당 이벤트 아이디와 일치하는 이벤트 찾기
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
      // 업데이트된 이벤트 배열을 events 객체에 할당
      return updatedEvents;
    });
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value); // 입력 필드의 값으로 newName 상태를 업데이트합니다.
  };

  //handleChangeName 이름 변경 함수
  const handleChangeName = () => {
    fetch("/user/updateUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newName: newName, usercode: userCode }),
    })
      .then((response) => {
        response.json();
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  // 검색어가 변경될 때마다 필터링
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState(receivedData.results);
  useEffect(() => {
    const results = receivedData.results.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredResults(results);
  }, [searchQuery, receivedData.results]);

  useEffect(() => {
    fetch("/todo/searchSchedule", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sendData),
    })
      .then((response) => response.json())
      .then((data) => {
        // 시작 날짜(start)가 빠른 순서대로 정렬
        const sortedResults = data.results.sort((a, b) => {
          return new Date(a.start) - new Date(b.start);
        });

        setReceivedData({ ...data, results: sortedResults });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [sendData]);

  useEffect(() => {
    if (receivedData && receivedData.results) {
      const updatedEvents = { ...events };
      receivedData.results.forEach((result) => {
        const eventData = {
          id: result.boardId,
          modalName: result.title,
          selectedDate: result.start.substring(0, 10),
          selectedEndDate: result.end.substring(0, 10),
          selectedColor: result.color,
          modalText: result.content,
        };
        // 이미 해당 날짜에 이벤트가 있는지 확인 후 추가
        if (!updatedEvents[result.start.substring(0, 10)]) {
          updatedEvents[result.start.substring(0, 10)] = [eventData];
        } else {
          // 중복 추가 방지
          const existingEventIndex = updatedEvents[
            result.start.substring(0, 10)
          ].findIndex((event) => event.id === result.boardId);
          if (existingEventIndex === -1) {
            updatedEvents[result.start.substring(0, 10)].push(eventData);
          }
        }
      });

      setEvents(updatedEvents);
    }
  }, [receivedData]);

  //maxLength를 넘어가면 뒷부분을 ...으로 처리하는 함수
  function truncateText(text, maxLength) {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + "...";
  }

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
            <span className={styles.highlight}>{username}</span>님의 캘린더
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
                    <input
                      type="checkbox"
                      name="color"
                      value={color}
                      onChange={(e) => checkOnlyOne(e.target)}
                    />
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
                          // 새로운 함수 생성 방지, e
                        >
                          {truncateText(event.modalName, 7)}
                          {/* {event.modalName} */}
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
              value={newName}
              onChange={handleNameChange}
            />
            <button className={style.okButton} onClick={handleChangeName}>
              확인
            </button>
          </div>
        )}
        {isSearchBoxClick && (
          <div className={style.searchBox}>
            <div className={style.searchInputBox}>
              <input
                className={style.searchInput}
                type="text"
                placeholder="검색어를 입력하세요."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {filteredResults.map((item) => {
              const colorClass = `color-${item.color.replace("#", "")}`;
              return !selectedColor ? (
                item.color === "#ccc" ? (
                  <div
                    className={`${style.searchResultBox} ${style[colorClass]}`}
                    key={item.title}
                    onClick={(e) => handleEventClick(item, e)}
                  >
                    <div className={style.searchResultName}>{item.title}</div>
                    <div className={style.searchResultDate}>
                      {item.start.split("T")[0]}~{item.end.split("T")[0]}
                    </div>
                  </div>
                ) : (
                  <></>
                )
              ) : selectedColor === item.color ? (
                <div
                  className={`${style.searchResultBox} ${style[colorClass]}`}
                  key={item.title}
                  onClick={(e) => handleEventClick2(e)}
                >
                  <div className={style.searchResultName}>{item.title}</div>
                  <div className={style.searchResultDate}>
                    {item.start.split("T")[0]}~{item.end.split("T")[0]}
                  </div>
                </div>
              ) : (
                <></>
              );
            })}
          </div>
        )}
      </div>

      {/* 새 일정 클릭 모달 */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedDate={selectedDate}
        selectedEndDate={selectedEndDate}
        onSave={handleSaveEvent}
      />
      {/* 기존 일정 클릭 모달 */}
      {selectedEvent && (
        <Modal
          isOpen={eventModalOpen}
          onClose={() => setEventModalOpen(false)}
          selectedDate={selectedDate}
          selectedEndDate={selectedEndDate}
          selectedEvent={selectedEvent}
          onSave={handleSaveEvent}
          // event={selectedEvent}
        />
      )}
    </div>
  );
};

export default Calender;
