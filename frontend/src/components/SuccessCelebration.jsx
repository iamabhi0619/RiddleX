import React, { useContext } from "react";
import "tailwindcss/tailwind.css";
import gameContext from "../context/gameContext";

const SuccessCelebration = () => {
  const {setCelebration} = useContext(gameContext)
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-700 bg-opacity-50 absolute overflow-hidden" onClick={()=>{setCelebration(false)}}>
      {/* Background Confetti Animation */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-fall"
            style={{
              top: `${Math.random() * -100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              animationDuration: `${Math.random() * 3 + 2}s`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Main Content */}
      <div className="text-center text-white z-10">
        <h1 className="text-6xl md:text-8xl font-bold drop-shadow-lg animate-bounce">
          ✨ Correct Answer! ✨
        </h1>
        <p className="mt-4 text-xl md:text-2xl font-medium">
          Great job! Let's move to the next riddle.
        </p>
      </div>

      {/* Fireworks Animation */}
      {/* <div className="absolute inset-0 flex justify-center items-center z-0">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full border-4 border-white animate-burst`}
            style={{
              width: `${Math.random() * 50 + 100}px`,
              height: `${Math.random() * 50 + 100}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div> */}
    </div>
  );
};

export default SuccessCelebration;

/* Add this to your global CSS (tailwind.config.css or another CSS file) */
/* Confetti Falling Animation */
