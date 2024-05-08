import React from "react";
import Board from "../component/Board";
import Calender from "../component/Calender";
import Gantt from "../component/Gantt";

const MainPage = () => {
  return (
    <div>
      <div>
        <Board></Board>
        <Calender></Calender>
        <Gantt></Gantt>
      </div>
    </div>
  );
};

export default MainPage;
