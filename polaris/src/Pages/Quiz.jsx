import React, { useState } from "react";
import SparkleBackground from "../components/SparkleBackground";
import Timer from "../components/Timer";

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
      setHighlight("red");
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
        <Timer/>
          <div className="question-container  bg-blue-900 items-center mb-5 justify-center border-2 border-yellow-400 rounded-lg">
                <h1 className="mt-6 text-3xl text-yellow-400">Question {currentQues + 1}</h1>
                <p className="mb-6 text-2xl text-white">{ques[currentQues].ques}</p>
            </div>
          <ul class="list-none p-0 grid grid-cols-2 gap-4 justify-center items-center">
            {ques[currentQues].options.map((option) => (
              <li

                key={option}
                className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-transform duration-200 transform hover:scale-105 shadow-md w-56 ${
                  selectedOption === option
                    ? option === ques[currentQues].correctAnswer
                      ? highlight === "green"
                        ? "bg-green-500 border-green-700"
                        : ""
                      : highlight === "red"
                      ? "bg-red-500 border-red-700"
                      : ""
                    : "bg-blue-900 border-yellow-400"
                }`
                
              }
              >
                <label className="w-full cursor-pointer">
                  <input
                    type="radio"
                    className="transform scale-150 mr-2"
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
          <button 
            className={`bg-yellow-400 text-black text-lg px-5 py-2.5 rounded mt-5 transition duration-300 hover:enabled:bg-yellow-500 hover:enabled:shadow-lg disabled:bg-gray-600 disabled:cursor-not-allowed`}
            onClick={handleSubmit}
            disabled={!selectedOption}>
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
