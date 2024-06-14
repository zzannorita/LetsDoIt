import React, { useEffect, useState } from "react";
import style from "./Board.module.css";
import ReactDatePicker from "react-datepicker";
import ko from "date-fns/locale/ko";
import "react-datepicker/dist/react-datepicker.css";
import { forwardRef } from "react";
//이미지 import
import search from "../../img/search.png";
import nochecked from "../../img/nochecked.png";
import trash from "../../img/trash.png";
import checked from "../../img/checked.png";

const Board = () => {
  const [userCode, setUserCode] = useState("5811");
  const [sendData, setSendData] = useState({ userCode: userCode });
  const [receivedData, setReceivedData] = useState();
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [toggleAdd, setToggleAdd] = useState(false);
  const [todoTitle, setTodoTitle] = useState("");
  const [todoContent, setTodoContent] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [toggleUpdate, setToggleUpdate] = useState(false);
  const [updateTodoTitle, setUpdateTodoTitle] = useState("");
  const [updateTodoContent, setUpdateTodoContent] = useState("");
  const [color, setColor] = useState("");

  const handleColorChange = (event) => {
    const { value } = event.target;
    setColor(value);
    console.log(color);
  };

  const handleStateToggle = (state, boardId, usercode) => {
    let sendState = "";
    if (state === "미완") {
      sendState = "완료";
    } else {
      sendState = "미완";
    }
    fetch("/todo/updateStateSchedule", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        state: sendState,
        boardId: boardId,
        usercode: usercode,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleUpdateTitleChange = (event) => {
    setUpdateTodoTitle(event.target.value);
  };
  const handleUpdateContentChange = (event) => {
    setUpdateTodoContent(event.target.value);
  };

  const handleUpdateToggle = () => {
    if (toggleUpdate) {
      setToggleUpdate(false);
    } else {
      setToggleUpdate(true);
    }
  };

  const handleTitleChange = (event) => {
    setTodoTitle(event.target.value);
  };
  const handleContentChange = (event) => {
    setTodoContent(event.target.value);
  };

  const handleAddTogle = () => {
    setToggleAdd(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: "2-digit", day: "2-digit" };
    return date.toLocaleDateString("en-US", options);
  };
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
  const handleTodoClick = (item) => {
    setSelectedTodo(item);
    setToggleAdd(false);
  };
  const handleAddTodo = () => {
    const sendInputData = {
      userCode: userCode,
      title: todoTitle,
      content: todoContent,
      start: formatDate2(startDate),
      end: formatDate2(endDate),
    };

    fetch("/todo/addSchedule", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sendInputData),
    })
      .then((response) => response.json())
      .then((data) => {
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleTodoDelete = () => {
    const userConfirmed = window.confirm("일정을 삭제 할까요?");
    const sendData = {
      userCode: userCode,
      boardId: selectedTodo.boardId,
    };
    if (userConfirmed) {
      fetch("/todo/deleteSchedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sendData),
      })
        .then((response) => response.json())
        .then((data) => {
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      console.log("삭제 로직 실행 하지 않음.");
    }
  };

  const handleTodoUpdate = () => {
    const userConfirmed = window.confirm("일정을 수정 할까요?");
    const sendData = {
      userCode: userCode,
    };
    const sendInputData = {
      userCode: userCode,
      title: updateTodoTitle,
      content: updateTodoContent,
      boardId: selectedTodo.boardId,
      start: formatDate2(startDate),
      end: formatDate2(endDate),
      color: color,
    };

    if (userConfirmed) {
      fetch("/todo/updateSchedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sendInputData),
      })
        .then((response) => response.json())
        .then((data) => {
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      console.log("삭제 로직 실행 하지 않음.");
    }
  };

  //
  const ITEMS_PER_PAGE = 9;
  const [currentPage, setCurrentPage] = useState(1);

  let paginatedData = [];
  let totalPages = 0;

  if (receivedData && receivedData.results) {
    // 수정된 부분: 현재 페이지에 표시할 항목 필터링
    paginatedData = receivedData.results.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
    // 수정된 부분: 총 페이지 수 계산
    totalPages = Math.ceil(receivedData.results.length / ITEMS_PER_PAGE);
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
  }, [sendData, currentPage]);

  return (
    <div className={style.container}>
      <div className={style.mainBox}>
        <div className={style.dayBox}>
          <div className={style.dayContentBox}>Todo</div>
        </div>
        <div className={style.contentBox}>
          <div className={style.doItBox}>
            <div className={style.doItContentBox}>
              <span>{userCode}</span> 님의 할 일 목록
            </div>
          </div>
          <div className={style.mainContentBox}>
            <div className={style.summaryBox}>
              <div className={style.summaryTitleBox}>
                <div className={style.summaryState}>상태</div>
                <div className={style.summaryTitle}>제목</div>
                <div className={style.summaryContent}>내용</div>
                <div className={style.summaryPeriod}>기간</div>
              </div>
              <div className={style.summaryTitleBoxLine}></div>
              <div className={style.summaryContentBox}>
                {receivedData && receivedData.results ? (
                  paginatedData.map((item, index) => (
                    <div
                      key={index}
                      className={style.summaryContentEach}
                      onClick={() => handleTodoClick(item)}
                    >
                      <div
                        style={{
                          backgroundColor: item.color,
                          width: "3%",
                          borderRadius: "50%",
                        }}
                      ></div>
                      <div
                        className={style.summaryCheckBox}
                        onClick={() => {
                          handleStateToggle(
                            item.state,
                            item.boardId,
                            item.usercode
                          );
                        }}
                      >
                        {item.state === "완료" ? (
                          <img src={checked} />
                        ) : (
                          <img src={nochecked} />
                        )}
                      </div>
                      <div className={style.summaryTitle}>{item.title}</div>
                      <div className={style.summaryContent}>{item.content}</div>
                      <div className={style.summaryPeriod}>
                        {formatDate(item.start)}~{formatDate(item.end)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div>일정이 존재하지 않습니다.</div>
                )}
              </div>
              <div className={style.summaryPagenationBox}>
                {[...Array(totalPages)].map((_, pageIndex) => (
                  <button
                    key={pageIndex}
                    onClick={() => handlePageChange(pageIndex + 1)}
                    className={
                      pageIndex + 1 === currentPage ? style.activePage : ""
                    }
                  >
                    {pageIndex + 1}
                  </button>
                ))}
              </div>
              <div className={style.summaryTodoAddBox}>
                <button onClick={handleAddTogle}>일정 추가</button>
              </div>
            </div>
            <div className={style.detailBox}>
              <div className={style.detailSearchBox}>
                <img src={search} className={style.detailSearchIcon} />
              </div>
              <div className={style.detailContentBox}>
                {!toggleAdd ? (
                  !selectedTodo ? (
                    <div className={style.detailContentNoneClickedState}>
                      할 일을 클릭하세요.
                    </div>
                  ) : (
                    <div className={style.detailContentClickedState}>
                      {toggleUpdate ? (
                        <div>
                          <div
                            className={style.detailContentClickedStateTitleBox}
                          >
                            <input
                              defaultValue={selectedTodo.title}
                              onChange={handleUpdateTitleChange}
                            />
                          </div>
                          <div
                            className={style.detailContentClickedStatePeriodBox}
                          >
                            <div>기간</div>
                            <div>
                              <ReactDatePicker
                                locale={ko}
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                placeholderText="시작"
                                className={style.customInput}
                                calendarClassName={style.customCalendar}
                                dateFormat="yyyy년 MM월 dd일"
                              />
                              <span>~</span>
                              <ReactDatePicker
                                locale={ko}
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                placeholderText="종료"
                                className={style.customInput}
                                calendarClassName={style.customCalendar}
                                dateFormat="yyyy년 MM월 dd일"
                              />
                            </div>
                            <div className={style.selectBox}>
                              <div className={style.colorBox}>
                                {[
                                  "#eeaaaa",
                                  "#efe2a1",
                                  "#c4e6ce",
                                  "#add0fb",
                                  "#cbb1ed",
                                ].map((color) => (
                                  <label
                                    key={color}
                                    className={`${style.checkbox_label} ${style.customColor}`}
                                    style={{ backgroundColor: color }}
                                  >
                                    <input
                                      type="checkbox"
                                      name="color"
                                      value={color}
                                      onChange={handleColorChange}
                                    />
                                    <span
                                      className={style.checkbox_icon}
                                    ></span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div
                            className={
                              style.detailContentClickedStateContentBox
                            }
                          >
                            <textarea
                              // value={selectedTodo.content}
                              defaultValue={selectedTodo.content}
                              onChange={handleUpdateContentChange}
                            />
                          </div>
                          <div
                            className={style.detailContentClickedStateButtonBox}
                          >
                            <button onClick={handleTodoUpdate}>저장</button>
                            <button onClick={handleUpdateToggle}>취소</button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div
                            className={style.detailContentClickedStateTitleBox}
                          >
                            <div>{selectedTodo.title}</div>
                            <img
                              src={trash}
                              alt="삭제 아이콘"
                              onClick={handleTodoDelete}
                            />
                          </div>
                          <div
                            className={style.detailContentClickedStatePeriodBox}
                          >
                            <div>기간</div>
                            <div>
                              {formatDate(selectedTodo.start)}~
                              {formatDate(selectedTodo.end)}
                            </div>
                            <div
                              className={
                                style.detailContentClickedStateColorBox
                              }
                              style={{ backgroundColor: selectedTodo.color }}
                            ></div>
                          </div>
                          <div
                            className={
                              style.detailContentClickedStateContentBox
                            }
                          >
                            <div>{selectedTodo.content}</div>
                          </div>
                          <div
                            className={style.detailContentClickedStateButtonBox}
                          >
                            <button onClick={handleUpdateToggle}>수정</button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                ) : (
                  <div className={style.detailAddClickedState}>
                    <div className={style.detailContentClickedStateTitleAddBox}>
                      <div>
                        <input
                          placeholder="제목"
                          onChange={handleTitleChange}
                        />
                      </div>
                    </div>
                    <div
                      className={style.detailContentClickedStatePeriodAddBox}
                    >
                      <div>기간</div>
                      <div>
                        <ReactDatePicker
                          locale={ko}
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          placeholderText="시작"
                          className={style.customInput}
                          calendarClassName={style.customCalendar}
                          dateFormat="yyyy년 MM월 dd일"
                        />
                      </div>
                      <span>-</span>
                      <div>
                        <ReactDatePicker
                          locale={ko}
                          selected={endDate}
                          onChange={(date) => setEndDate(date)}
                          placeholderText="종료"
                          className={style.customInput}
                          calendarClassName={style.customCalendar}
                          dateFormat="yyyy년 MM월 dd일"
                        />
                      </div>
                    </div>
                    <div
                      className={style.detailContentClickedStateContentAddBox}
                    >
                      <div>
                        <textarea
                          placeholder="내용"
                          onChange={handleContentChange}
                        />
                      </div>
                    </div>
                    <div
                      className={style.detailContentClickedStateAddButtonBox}
                    >
                      <div>
                        <button onClick={handleAddTodo}>작성</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Board;
