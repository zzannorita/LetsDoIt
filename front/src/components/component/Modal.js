import React, { useState, useEffect } from "react";
import styles from "./Modal.module.css";
import style from "./Calender.module.css";

const Modal = ({ isOpen, onClose, selectedDate, onSave, selectedEvent }) => {
  const [modalName, setModalName] = useState("");
  const [modalText, setModalText] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (selectedEvent) {
        setModalName(selectedEvent.modalName);
        setModalText(selectedEvent.modalText);
        setSelectedColor(selectedEvent.selectedColor);
        setIsEdit(true);
      } else {
        // 모달이 열릴 때 상태를 초기화
        setModalName("");
        setSelectedColor("");
        setModalText("");
        setIsEdit(false);
      }
    }
  }, [isOpen, selectedEvent]);

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
      selectedDate,
      selectedColor: colorToSave,
      modalText,
    };
    onSave(eventData);
    onClose();
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
              // style={{ backgroundColor: selectedColor }}
            ></input>
            <div className={styles.closeButton} onClick={onClose}>
              &times;
            </div>
          </div>
          <div className={styles.modalPeriodBox}>
            <div className={styles.periodName}>기간</div>
            <div className={styles.periodNum}>{selectedDate}</div>
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
            <button className={styles.okButton} onClick={handleSave}>
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
