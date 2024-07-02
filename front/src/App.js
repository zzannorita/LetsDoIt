import { useState } from "react";
import "./App.css";
import Login from "./components/navi/Login";
import MainPage from "./components/navi/MainPage";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate,
} from "react-router-dom";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userCode, setUserCode] = useState(
    localStorage.getItem("userCode") || null
  );
  //const navigate = useNavigate(); // useNavigate 훅 사용

  const handleLogin = (userCode) => {
    setIsLoggedIn(true);
    setUserCode(userCode);
    localStorage.setItem("userCode", userCode); // 사용자 코드 저장
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserCode(null);
    localStorage.removeItem("userCode");
    //navigate("/");
    console.log("이즈로그드인", isLoggedIn);
  };
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <Router>
            <Routes>
              <Route
                path="/"
                element={
                  isLoggedIn ? (
                    <Navigate to="/main" />
                  ) : (
                    <Login onLogin={handleLogin} />
                  )
                }
              />
              <Route
                path="/main"
                element={
                  <MainPage userCode={userCode} onLogout={handleLogout} />
                }
              />
            </Routes>
          </Router>
        </div>
      </header>
    </div>
  );
}

export default App;
