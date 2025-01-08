import React, { useContext } from "react";
import { FaHeart, FaHeartBroken, FaLightbulb } from "react-icons/fa";
import { MdOutlineHistory } from "react-icons/md";
import userContext from "../context/userContext";
import gameContext from "../context/gameContext";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { toast } from "react-toastify";

function ScoreSection() {
  const { score, availableHints, token, setAvailableHints } =
    useContext(userContext);
  const { showHistory, setShowHistory, setHint } = useContext(gameContext);

  const handleHint = async () => {
    const response = await fetch("/api/riddles/hint", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      return toast.error(data.error);
    }
    setHint(data);
    setAvailableHints(availableHints - 1);
    toast.success("Hint Sucessfull fetched..!!");
  };

  return (
    <div className="flex items-center justify-between bg-light shadow-2xl min-w-lg max-w-xl w-full border-4 border-white py-2 rounded-3xl px-3">
      <Tooltip id="my-tooltip" />
      <div className="text-xl font-fredoka text-primary font-semibold tracking-wide text-center">
        <p>Total: {score ? score.totalScore : "Loading"}</p>
        <p>Current Level: {score ? Math.floor(score.level) : "Loading"}</p>
      </div>
      <div className="flex items-center text-2xl gap-3">
        <div className="flex gap-2 text-2xl text-red-700">
          {availableHints === 3 ? (
            <>
              <FaHeart />
              <FaHeart />
              <FaHeart />
            </>
          ) : availableHints === 2 ? (
            <>
              <FaHeart />
              <FaHeart />
              <FaHeartBroken />
            </>
          ) : availableHints === 1 ? (
            <>
              <FaHeart />
              <FaHeartBroken />
              <FaHeartBroken />
            </>
          ) : (
            <>
              <FaHeartBroken />
              <FaHeartBroken />
              <FaHeartBroken />
            </>
          )}
        </div>
        <div
          className="cursor-pointer"
          data-tooltip-id="my-tooltip"
          data-tooltip-content="View your history"
          data-tooltip-place="bottom"
          onClick={() => {
            setShowHistory(!showHistory);
          }}
        >
          <MdOutlineHistory />
        </div>
        <div
          onClick={handleHint}
          className="text-amber-600 cursor-pointer"
          data-tooltip-id="my-tooltip"
          data-tooltip-content="Click to use a hint"
          data-tooltip-place="bottom"
        >
          <FaLightbulb />
        </div>
      </div>
    </div>
  );
}

export default ScoreSection;
