import React, { useContext, useState, useCallback } from "react";
import { FaArrowCircleRight, FaLanguage } from "react-icons/fa";
import { IoLanguage } from "react-icons/io5";
import { RiEnglishInput } from "react-icons/ri";
import gameContext from "../context/gameContext";
import userContext from "../context/userContext";

function GameSection() {
  const { token, setScore } = useContext(userContext);
  const {
    activeLang,
    setActiveLang,
    questionText,
    fetchQuestion,
    elapsedTime,
    setElapsedTime,
    hint,
    setCelebration,
  } = useContext(gameContext);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const formatTime = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      secs < 10 ? "0" : ""
    }${secs}`;
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      setSubmitError(null);
      try {
        const response = await fetch("/api/riddles/check", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ answer, time: elapsedTime }),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data);
        if (data.isCorrect) {
          setCelebration(true);
          setElapsedTime(0);
          setScore(data.user.scores);
          setAnswer("");
        } else {
          alert("Wrong Answer...!!\nKeep guessing..!!");
        }
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        setSubmitError(
          "There was a problem submitting your answer. Please try again."
        );
      }
      setLoading(false);
    },
    [answer, token, setCelebration, setScore, fetchQuestion]
  );

  return (
    <div className="border-4 border-white p-6 rounded-3xl bg-light shadow-2xl min-w-lg max-w-xl w-full">
      {/* Language Selector */}
      <div className="mb-6 flex flex-col md:flex-row gap-3 md:gap-0 items-center justify-between">
        <div>
          <p className="text-3xl font-mono">{formatTime(elapsedTime)}</p>
        </div>
        <div>
          <ul className="flex w-full space-x-2 font-semibold font-poppins">
            <li
              className={`flex cursor-pointer duration-300 items-center space-x-1 py-1 px-3 rounded-lg ${
                activeLang === "English"
                  ? "bg-primary text-white"
                  : "bg-light text-primary"
              }`}
              onClick={() => setActiveLang("English")}
            >
              <RiEnglishInput size={18} /> <p>English</p>
            </li>
            <li
              className={`flex cursor-pointer duration-300 items-center space-x-1 py-1 px-3 rounded-lg ${
                activeLang === "Hinglish"
                  ? "bg-primary text-white"
                  : "bg-light text-primary"
              }`}
              onClick={() => setActiveLang("Hinglish")}
            >
              <FaLanguage size={24} /> <p>Hinglish</p>
            </li>
            <li
              className={`flex cursor-pointer duration-300 items-center space-x-1 py-1 px-3 rounded-lg ${
                activeLang === "Hindi"
                  ? "bg-primary text-white"
                  : "bg-light text-primary"
              }`}
              onClick={() => setActiveLang("Hindi")}
            >
              <IoLanguage size={20} /> <p>Hindi</p>
            </li>
          </ul>
        </div>
      </div>

      {/* Riddle and Input */}
      <div className="text-center mt-6">
        <p className="text-2xl font-fredoka font-semibold text-primary mb-8">
          {questionText}
          <br />
          {hint && (
            <span className="font-mukta font-semibold tracking-wide text-lg text-red-600">
              {hint[activeLang]}
            </span>
          )}
        </p>

        <form className="relative" onSubmit={handleSubmit}>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full p-3 rounded-lg shadow-md border border-light-gray focus:outline-none focus:ring-2 focus:ring-primary pl-4 pr-12"
            placeholder="Answer goes here"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary hover:text-accent flex items-center space-x-1"
            disabled={loading}
          >
            <FaArrowCircleRight size={24} />
            <p className="font-poppins font-semibold">
              {loading ? "Submitting..." : "Check"}
            </p>
          </button>
        </form>
        {submitError && <p className="text-red-500 mt-4">{submitError}</p>}
      </div>
    </div>
  );
}

export default GameSection;
