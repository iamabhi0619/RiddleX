import React, { useEffect, useContext, useState, useCallback } from "react";
import gameContext from "./gameContext";
import userContext from "./userContext";

const GameProvider = ({ children }) => {
  const { token } = useContext(userContext);
  const [question, setQuestion] = useState(null);
  const [celebration, setCelebration] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState(null);
  const [activeLang, setActiveLang] = useState("English");
  const [hint, setHint] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(() => {
    const storedTime = localStorage.getItem("time");
    return storedTime ? parseInt(storedTime, 10) : 0;
  });
  const [timer, setTimer] = useState(null);

  const fetchQuestion = useCallback(async () => {
    if (!token) {
      setError("Authentication token is missing.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/riddles/getone", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch question.");
      }
      const data = await response.json();
      const present = localStorage.getItem("Id");
      if (present != data.questionId) {
        setElapsedTime(0);
        localStorage.setItem("Id", data.questionId);
      }
      setQuestion({
        ...data,
        questionText: {
          English: data.questionText?.English || "",
          Hindi: data.questionText?.Hindi || "",
          Hinglish: data.questionText?.Hinglish || "",
        },
      });
    } catch (err) {
      setError(err.message || "Error fetching question.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchQuestion();
  }, [token, fetchQuestion]);

  useEffect(() => {
    if (question) {
      const text =
        question.questionText?.[activeLang] ||
        `No question available in ${activeLang}`;
      setQuestionText(text);
    }
  }, [activeLang, question]);

  useEffect(() => {
    if (question && !question.isSolved) {
      if (timer) {
        clearInterval(timer);
      }
      const newTimer = setInterval(() => {
        setElapsedTime((prevTime) => {
          const updatedTime = prevTime + 1;
          localStorage.setItem("time", updatedTime);
          return updatedTime;
        });
      }, 1000);
      setTimer(newTimer);
      return () => clearInterval(newTimer);
    }
  }, [question]);

  return (
    <gameContext.Provider
      value={{
        question,
        celebration,
        setCelebration,
        activeLang,
        setActiveLang,
        elapsedTime,
        questionText,
        hint,
        setHint,
        showHistory,
        setShowHistory,
        setElapsedTime,
        fetchQuestion,
        loading,
        error,
      }}
    >
      {children}
    </gameContext.Provider>
  );
};

export default GameProvider;
