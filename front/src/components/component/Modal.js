import React, { useState, useEffect } from "react";
import styles from "./Modal.module.css";
import style from "./Calender.module.css";
import ReactDatePicker from "react-datepicker";
import ko from "date-fns/locale/ko";
import trash from "../../img/trash.png";

const Modal = ({
  isOpen,
  onClose,
  selectedDate,
  selectedEndDate,
  onSave,
  selectedEvent,
}) => {
  const [modalName, setModalName] = useState("");
  const [modalText, setModalText] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState();
  //datePicker 관련
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };
  //

  const userCode = "5811";

  useEffect(() => {
    if (isOpen) {
      // 기존 일정 모달 클릭 시
      if (selectedEvent) {
        setModalName(selectedEvent.modalName);
        setModalText(selectedEvent.modalText);
        setSelectedColor(selectedEvent.selectedColor);
        setIsEdit(true);
        setStartDate(new Date(selectedEvent.selectedDate));
        setEndDate(new Date(selectedEvent.selectedEndDate));
        setSelectedBoardId(selectedEvent.id);
      } else {
        // 새 일정 모달 클릭 시
        // 모달이 열릴 때 상태를 초기화
        setModalName("");
        setSelectedColor("");
        setModalText("");
        setIsEdit(false);
        setStartDate(new Date(selectedDate));
        setEndDate(new Date(selectedDate));
      }
    }
  }, [isOpen, selectedEvent]);

  //모달이 닫혀있을 때 불필요한 렌더링 방지
  if (!isOpen) return null;

  //체크박스 중복 방지
  const checkOnlyOne = (checkThis) => {
    const checkBoxes = document.getElementsByName("color");
    for (let i = 0; i < checkBoxes.length; i++) {
      if (checkBoxes[i] !== checkThis) {
        checkBoxes[i].checked = false;
      }
    }
    setSelectedColor(checkThis.value);
  };

  //저장 함수
  const handleSave = () => {
    const colorToSave = selectedColor || "#ccc";
    const eventData = {
      id: isEdit ? selectedEvent.id : new Date().getTime(),
      modalName,
      startDate,
      endDate,
      selectedColor: colorToSave,
      modalText,
    };
    onSave(eventData);
    handleAddTodo();
    onClose();
  };

  //수정 함수
  const handleUpdate = () => {
    const selectedDateStr = selectedDate;
    const selectedDate2 = new Date(selectedDateStr);
    selectedDate2.setMinutes(selectedDate2.getMinutes() + 30);
    const sendInputData = {
      userCode: userCode,
      title: modalName,
      content: modalText,
      start: formatDate2(startDate),
      end: formatDate2(endDate),
      color: selectedColor,
      boardId: selectedBoardId,
    };

    fetch("/todo/UpdateSchedule", {
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

  //글 데이터 베이스 저장 함수
  const handleAddTodo = () => {
    const selectedDateStr = selectedDate;
    const selectedDate2 = new Date(selectedDateStr);
    selectedDate2.setMinutes(selectedDate2.getMinutes() + 30);
    const sendInputData = {
      userCode: userCode,
      title: modalName,
      content: modalText,
      start: formatDate2(startDate),
      end: formatDate2(endDate),
      color: selectedColor,
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

  //삭제 함수
  const handleTodoDelete = () => {
    const userConfirmed = window.confirm("일정을 삭제 할까요?");
    const sendData = {
      userCode: userCode,
      boardId: selectedBoardId,
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

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalBox}>
          <div className={styles.modalNameBox}>
            <input
              className={styles.modalName}
              type="text"
              placeholder="제목을 입력하세요."
              value={modalName}
              onChange={(e) => setModalName(e.target.value)}
            ></input>
            {selectedEvent ? (
              <div className={styles.closeButton} onClick={handleTodoDelete}>
                <img src={trash} alt="쓰레기통 아이콘" />
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className={styles.modalPeriodBox}>
            <div className={styles.periodName}>기간</div>
            <div className={styles.periodNum}>
              <ReactDatePicker
                selectsRange={true}
                className={styles.datepicker}
                calendarClassName={style.calenderWrapper}
                popperClassName={style.calenderPopper}
                locale={ko}
                dateFormat="MM월 dd일"
                selected={startDate}
                startDate={startDate}
                endDate={endDate}
                // maxDate={new Date()}
                onChange={(date) => handleDateChange(date)}
              />
            </div>
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
                      checked={color === selectedColor}
                    />
                    <span className={style.checkbox_icon}></span>
                  </label>
                )
              )}
            </div>
          </div>
          <div className={styles.modalTextBox}>
            <textarea
              className={styles.modalText}
              placeholder="내용을 입력하세요."
              value={modalText}
              onChange={(e) => setModalText(e.target.value)}
            ></textarea>
          </div>
          <div className={styles.modalOkBox}>
            {!selectedEvent ? (
              <button className={styles.okButton} onClick={handleSave}>
                확인
              </button>
            ) : (
              <button className={styles.okButton} onClick={handleUpdate}>
                수정
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
