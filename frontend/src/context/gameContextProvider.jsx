import React, { useEffect, useContext, useState } from "react";
import gameContext from "./gameContext";
import userContext from "./userContext";

const GameProvider = ({ children }) => {
  const { token } = useContext(userContext);
  const [question, setQuestion] = useState(null);
  const [celebration, setCelebration] = useState(false);
  const [questionText, setQuestionText] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeLang, setActiveLang] = useState("English");

  const fetchQuestion = async () => {
    if (!token) {
      setError("Authentication token is missing.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/api/riddles/getone", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch question.");
      const data = await response.json();
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
  };

  const submitAnswer = async (answer) => {
    if (!answer) return { success: false, message: "Answer cannot be empty." };
    try {
      const response = await fetch("/api/riddles/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ answer }),
      });
      if (!response.ok) throw new Error("Failed to check the answer.");
      const data = await response.json();
      if (data.isCorrect) {
        setCelebration(true);
        fetchQuestion();
      }
      return {
        success: data.isCorrect,
        message: data.isCorrect ? "Correct!" : "Wrong Answer. Keep guessing!",
      };
    } catch (err) {
      return {
        success: false,
        message: err.message || "Error checking the answer.",
      };
    }
  };

  useEffect(() => {
    if (token) fetchQuestion();
  }, [token]);

  useEffect(() => {
    if (question) {
      if (activeLang === "English") {
        setQuestionText(
          question.questionText?.English || "No question available in English"
        );
      } else if (activeLang === "Hindi") {
        setQuestionText(
          question.questionText?.Hindi || "No question available in Hindi"
        );
      } else if (activeLang === "Hinglish") {
        setQuestionText(
          question.questionText?.Hinglish || "No question available in Hinglish"
        );
      } else {
        setQuestionText("No question");
      }
    }
  }, [activeLang, question]);

  return (
    <gameContext.Provider
      value={{
        question,
        celebration,
        setCelebration,
        activeLang,
        setActiveLang,
        questionText,
        fetchQuestion,
        submitAnswer,
        loading,
        error,
      }}
    >
      {children}
    </gameContext.Provider>
  );
};

export default GameProvider;
