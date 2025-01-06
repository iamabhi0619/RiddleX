import React, { useContext } from "react";
import { FaHeart, FaHeartBroken } from "react-icons/fa";
import { MdOutlineHistory } from "react-icons/md";
import userContext from "../context/userContext";

function ScoreSection() {
  const { score, availableHints } = useContext(userContext);
  return (
    <div className="flex items-center justify-between bg-light shadow-2xl min-w-lg max-w-xl w-full border-4 border-white py-2 rounded-3xl px-3">
      <div className="text-xl font-fredoka text-primary font-semibold tracking-wide text-center">
        <p>Total:- {score ? score.totalScore : "Loding"}</p>
        <p>Current Level {score ? Math.floor(score.level) : "Loding"}</p>
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
        <div className="bg-primary p-1 cursor-pointer hover:text-3xl text-white rounded-full duration-300">
          <MdOutlineHistory className="" />
        </div>
      </div>
    </div>
  );
}

export default ScoreSection;
