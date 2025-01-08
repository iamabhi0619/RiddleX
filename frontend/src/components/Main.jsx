import React, { useContext, useState } from "react";
import GameSection from "./GameSection";
import ScoreSection from "./ScoreSection";
import SuccessCelebration from "./SuccessCelebration";
import gameContext from "../context/gameContext";
import History from "./History";

function Main() {
  const { celebration, showHistory } = useContext(gameContext);
  return (
    <div className="h-full flex flex-col gap-5 items-center justify-center w-full my-auto">
      <ScoreSection />
      <GameSection />
      {celebration && <SuccessCelebration />}
      {showHistory && <History />}
    </div>
  );
}

export default Main;
