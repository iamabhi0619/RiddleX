import React, { useContext } from "react";
import GameSection from "./GameSection";
import ScoreSection from "./ScoreSection";
import SuccessCelebration from "./SuccessCelebration";
import gameContext from "../context/gameContext";

function Main() {
  const { celebration } = useContext(gameContext);
  return (
    <div className="relative h-full flex flex-col gap-5 items-center justify-center w-full">
      <ScoreSection />
      <GameSection />
      {celebration && <SuccessCelebration />}
    </div>
  );
}

export default Main;
