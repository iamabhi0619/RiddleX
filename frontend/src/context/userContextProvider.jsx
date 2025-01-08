import React, { useState, useEffect } from "react";
import userContext from "./userContext";
import { useNavigate } from "react-router-dom";

const UserProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem("user"));
  const [user, setUser] = useState(null);
  const [score, setScore] = useState(null);
  const [availableHints, setAvailableHints] = useState(null);
  const [notifications, setNotifications] = useState(
    JSON.parse(localStorage.getItem("notifications")) || []
  );

  const logout = async () => {
    setToken(null);
    setUser(null);
    localStorage.clear()
    navigate("/login");
  };
  useEffect(() => {
    const fetchSession = async () => {
      if (!token) {
        navigate("/login");
      } else {
        try {
          const response = await fetch("/api/user/session", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setUser(data);
          setScore(data.scores);
          setAvailableHints(data.availableHints);
        } catch (error) {
          console.error("There was a problem with the fetch operation:", error);
          navigate("/login");
        }
      }
    };
    fetchSession();
  }, [token]);
  return (
    <userContext.Provider
      value={{
        token,
        setToken,
        user,
        setUser,
        score,
        logout,
        setScore,
        availableHints,
        setAvailableHints,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </userContext.Provider>
  );
};
export default UserProvider;
