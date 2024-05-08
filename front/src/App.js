import logo from "./logo.svg";
import "./App.css";
import Login from "./components/navi/Login";
import MainPage from "./components/navi/MainPage";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>초리 유디 화잇팅</div>
        <div>
          <Login></Login>
          <div>컴포넌트들 테스트</div>
          <MainPage></MainPage>
        </div>
      </header>
    </div>
  );
}

export default App;
