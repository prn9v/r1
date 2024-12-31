import React, { useState } from "react";
import "../components/Quiz.css";
import SparkleBackground from "../components/SparkleBackground";

const ques = [
  {
    ques: "What is the capital of France?",
    options: ["Paris", "Berlin", "Rome", "Madrid"],
    correctAnswer: "Paris",
  },
  {
    ques: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctAnswer: "4",
  },
  {
    ques: "What is the largest planet in the Solar System?",
    options: ["Earth", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Jupiter",
  },
];

const Quiz = () => {
  const [currentQues, setCurrentQues] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [highlight, setHighlight] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (selectedOption === ques[currentQues].correctAnswer) {
      setHighlight("green");
    } else {
      setHighlight("yellow");
    }

    setTimeout(() => {
      if (currentQues < ques.length - 1) {
        setHighlight(null);
        setSelectedOption("");
        setCurrentQues((prev) => prev + 1);
      } else {
        setIsSubmitted(true);
      }
    }, 1000);
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-blue-800 to-black flex flex-col items-center justify-center relative overflow-hidden">
      <SparkleBackground/>
    <div className="quiz-container">
      <div class="quiz-content relative  text-center p-5 max-w-lg mx-auto">
      {!isSubmitted ? (
        <>
          <h1 class="mt-5 text-3xl text-yellow-400">Question {currentQues + 1}</h1>
          <p class="text-2xl mb-5">{ques[currentQues].ques}</p>
          <ul>
            {ques[currentQues].options.map((option) => (
              <li
                key={option}
                style={{
                  backgroundColor:
                    selectedOption === option
                      ? option === ques[currentQues].correctAnswer
                        ? highlight === "green"
                          ? "green"
                          : ""
                        : highlight === "yellow"
                        ? "yellow"
                        : ""
                      : "var(--default-gradient)",
                }}
              >
                <label>
                  <input
                    type="radio"
                    name="option"
                    value={option}
                    checked={selectedOption === option}
                    onChange={() => handleOptionSelect(option)}
                  />
                  {option}
                </label>
              </li>
            ))}
          </ul>
          <button onClick={handleSubmit} disabled={!selectedOption}>
            Submit
          </button>
        </>
      ) : (
        <div>
          <h1 class="mt-5 text-3xl text-yellow-400">Quiz Completed!</h1>
        </div>
      )}
    </div>
    </div>
    </div>
  );
};

export default Quiz;
