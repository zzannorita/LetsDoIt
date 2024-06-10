import "./App.css";
import Login from "./components/navi/Login";
import MainPage from "./components/navi/MainPage";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>
          {/* <Login></Login>
          <div>컴포넌트들 테스트</div> */}
          {/* <MainPage></MainPage> */}
          <Router>
            <MainPage />
          </Router>
        </div>
      </header>
    </div>
  );
}

export default App;
