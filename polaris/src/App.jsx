import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeScreen from "./Pages/HomeScreen";
import Login from "./Pages/Login";
import Quiz from "./components/Quiz.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/quiz" element={<Quiz/>}/>
      </Routes>
    </Router>
  );
};

export default App;
