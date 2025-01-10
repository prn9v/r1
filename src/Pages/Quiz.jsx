import { useState, useEffect, useRef } from "react";
import SparkleBackground from "../components/SparkleBackground";
import Timer from "../components/Timer";
import { getDatabase, ref, get, update } from "firebase/database";
import { useFirebase } from "../firebase";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQues, setCurrentQues] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [highlight, setHighlight] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userId, setUserId] = useState(null);
  const [seconds, setSeconds] = useState(30);
  const [confirmSelection, setConfirmSelection] = useState(false);
  const [toggleLeaderboard, setToggleLeaderboard] = useState(false);
  const timerRef = useRef(null);

  if (timerRef.current === null && !isSubmitted) {
    timerRef.current = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds > 0 ? prevSeconds - 1 : 0);
    }, 1000);
  }
  if (isSubmitted) clearInterval(timerRef.current);

  const firebase = useFirebase();

  useEffect(() => {
    if (firebase?.user) {
      setUserId(firebase.user.uid);
    }
  }, [firebase?.user]);

  useEffect(() => {
    const fetchQuestions = async () => {
      const db = getDatabase();
      const dbRef = ref(db, "Question1");

      try {
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const formattedQuestions = Object.values(data).map((q) => ({
            ques: q.question,
            options: q.options,
            correctAnswer: q.correctOption,
          }));
          setQuestions(formattedQuestions);
        } else {
          console.log("No questions available");
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  const handleOptionSelect = (option) => {
    if (!confirmSelection)
      setSelectedOption(option);
  };

  const updateScore = async () => {
    if (!userId) {
      console.error("User ID is not available.");
      return;
    }

    const db = getDatabase();
    const teamRef = ref(db, `teams/${userId}`);

    try {
      const snapshot = await get(teamRef);
      if (snapshot.exists()) {
        const currentData = snapshot.val();
        const updatedData = {
          round1: (currentData.round1 || 0) + 10,
          overall: (currentData.overall || 0) + 10,
        };
        await update(teamRef, updatedData);
      } else {
        await update(teamRef, {
          round1: 10,
          overall: 10,
        });
      }
    } catch (error) {
      console.error("Error updating score:", error);
    }
  };

  if (seconds <= 0) {
    if (selectedOption === questions[currentQues].correctAnswer) {
      setHighlight("green");
      (async () => await updateScore())();
    } else {
      setHighlight("red");
    }
    if (currentQues + 1 >= questions.length) {
      setSeconds(5);
      setTimeout(() => {
        setIsSubmitted(true);
      }, 5000)
    } else {
      setTimeout(() => {
        setToggleLeaderboard(true);
      }, 5000)

      setTimeout(() => {
        setHighlight(null);
        setSelectedOption("");
        setCurrentQues((prev) => prev + 1);
        setToggleLeaderboard(false);
        setConfirmSelection(false);
      }, 10000)
      setSeconds(40); // 40 = 30 per Q + 5 sec solution + 5 sec leaderboard
    }
    // console.log(currentQues)
  }

  const handleSubmit = function () {
    setConfirmSelection(true);
  }

  // const handleSubmit = async () => {
  //   if (selectedOption === questions[currentQues].correctAnswer) {
  //     setHighlight("green");
  //     await updateScore();
  //   } else {
  //     setHighlight("red");
  //   }

  //   setTimeout(() => {
  //     if (currentQues < questions.length - 1) {
  //       setHighlight(null);
  //       setSelectedOption("");
  //       setCurrentQues((prev) => prev + 1);
  //       setSeconds(30);
  //     } else {
  //       setIsSubmitted(true);
  //     }
  //   }, 10000);
  // };

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-blue-800 to-black flex flex-col items-center justify-center relative overflow-hidden">
      <SparkleBackground />

      <div className="quiz-container">
        <div className="quiz-content relative text-center p-5 max-w-lg mx-auto">
          {!isSubmitted ? (
            questions.length > 0 ? (
              <>
                <Timer seconds={seconds} />
                <div className="question-container bg-blue-900 items-center mb-5 justify-center border-2 border-yellow-400 rounded-lg cursor-none">
                  <h1 className="mt-6 text-3xl text-yellow-400">
                    Question {currentQues + 1}
                  </h1>
                  <p className="mb-6 text-2xl text-white">
                    {questions[currentQues].ques}
                  </p>
                </div>

                <ul className="list-none p-0 grid grid-cols-1 sm:grid-cols-2 gap-4 justify-center items-center cursor-none">
                  {questions[currentQues].options.map((option) => (
                    <li
                      key={option}
                      className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-transform duration-200 transform hover:scale-105 shadow-md w-full sm:w-56 mx-auto ${selectedOption === option
                        ? option === questions[currentQues].correctAnswer
                          ? highlight === "green"
                            ? "bg-green-500 border-green-700"
                            : ""
                          : highlight === "red"
                            ? "bg-red-500 border-red-700"
                            : ""
                        : "bg-blue-900 border-yellow-400"
                        }`}
                    >
                      <button
                        type="button"
                        className="w-full transform p-2 text-center rounded-lg transition duration-300 focus:outline-none active:bg-blue-700 hover:bg-blue-800"
                        onClick={() => handleOptionSelect(option)}
                      >
                        {option}
                      </button>
                    </li>
                  ))}
                </ul>

                <button
                  className="bg-yellow-400 text-black text-lg px-5 py-2.5 rounded mt-5 transition duration-300 hover:enabled:bg-yellow-500 hover:enabled:shadow-lg disabled:bg-gray-600 disabled:cursor-not-allowed"
                  onClick={handleSubmit} // submission is based on time, here just set button to "submitted" and disable ability to switch selected option
                  disabled={!selectedOption}
                >
                  {confirmSelection ? "Submitted" : "Submit"}
                </button>
              </>
            ) : (
              <h1 className="text-2xl text-white">Loading questions...</h1>
            )
          ) : (
            <div>
              <h1 className="mt-5 text-3xl text-yellow-400">Quiz Completed!</h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
