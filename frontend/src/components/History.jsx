import React, { useContext, useEffect, useState } from "react";
import { FaClock, FaXmark } from "react-icons/fa6";
import gameContext from "../context/gameContext";
import userContext from "../context/userContext";
function History() {
  const { activeLang, setShowHistory } = useContext(gameContext);
  const { token } = useContext(userContext);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const dayName = date.toLocaleString("en-US", { weekday: "short" });
    const monthName = date.toLocaleString("en-US", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const time = `${formattedHours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")} ${period}`;
    return `${dayName} ${monthName} ${day} ${year} ${time}`;
  };
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("/api/user/history", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch history data.");
        }
        const data = await response.json();
        setHistoryData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [token]);
  if (loading) {
    return (
      <div className="fixed right-0 h-full bg-white z-50 px-3 w-full max-w-md">
        <div className="flex items-center justify-between px-5 pt-6 py-2 text-xl text-primary">
          <div className="flex items-center gap-3">
            <FaClock />
            <p className="font-poppins font-semibold tracking-wide">History</p>
          </div>
          <div
            className="hover:rotate-180 duration-500"
            onClick={() => {
              setShowHistory(false);
            }}
          >
            <FaXmark />
          </div>
        </div>
        <p className="text-center">Loading...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="fixed right-0 h-full bg-white z-50 px-3 w-full max-w-md">
        <div className="flex items-center justify-between px-5 pt-6 py-2 text-xl text-primary">
          <div className="flex items-center gap-3">
            <FaClock />
            <p className="font-poppins font-semibold tracking-wide">History</p>
          </div>
          <div
            className="hover:rotate-180 duration-500"
            onClick={() => {
              setShowHistory(false);
            }}
          >
            <FaXmark />
          </div>
        </div>
        <p className="text-center text-red-500">{error}</p>
      </div>
    );
  }
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      secs < 10 ? "0" : ""
    }${secs}`;
  };
  return (
    <div className="fixed right-0 h-full bg-white z-50 px-3 w-full max-w-md">
      <div className="flex items-center justify-between px-5 pt-6 py-2 text-xl text-primary">
        <div className="flex items-center gap-3">
          <FaClock />
          <p className="font-poppins font-semibold tracking-wide">History</p>
        </div>
        <div
          className="hover:rotate-180 duration-500"
          onClick={() => {
            setShowHistory(false);
          }}
        >
          <FaXmark />
        </div>
      </div>
      <div className="w-full overflow-y-scroll h-full">
        {historyData.length === 0 ? (
          <p className="text-center text-gray-500">No history available.</p>
        ) : (
          historyData.map((record, index) => (
            <div
              key={index}
              className="border-4 border-double p-2 border-light rounded-xl bg-pale text-lg font-poppins mb-4"
            >
              <p className="text-primary text-center font-semibold">
                {record.questionText[activeLang]}
              </p>
              <div className="flex items-center justify-evenly font-semibold">
                <p
                  className={`${
                    record.isCorrect ? "text-green-900" : "text-red-800"
                  }`}
                >
                  Attempted: {record.attemptedAnswer}
                </p>
                {record.isCorrect && (
                  <p>Correct: {record.correctAnswer[activeLang]}</p>
                )}
              </div>
              <p className="text-center">
                {record.hintsUsed > 0
                  ? `Hints Used: ${record.hintsUsed}`
                  : "Hurray.!! No Hint Used"}
              </p>
              {record.isCorrect && (
                <div className="flex items-center justify-between">
                  <p>Time Taken: {formatTime(record.timeTakenSeconds)}</p>
                  <p className="text-sm">{formatDate(record.solvedAt)}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
export default History;