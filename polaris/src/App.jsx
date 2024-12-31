import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeScreen from "./Pages/HomeScreen";
import Login from "./Pages/Login";
import Quiz from "./Pages/Quiz.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/quiz" element={<Quiz/>}/>
      </Routes>
    </Router>
  );
};

export default App;
