import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import OTPInput from "react-otp-input";
import userContext from "../context/userContext";

function Verify() {
  const [otp, setOtp] = useState(null);
  const [otpError, setOtpError] = useState(null);
  const { setToken, setUser } = useContext(userContext);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  console.log(email);
  const handleOTPSubmit = async () => {
    if (otp.length !== 6) {
      setOtpError("OTP must be 6 digits.");
      return;
    }
    setOtpError(null);
    try {
      const response = await fetch("/api/user/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp, email }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      // Handle successful verification
      if (data.token) {
        setToken(data.token);
        localStorage.setItem("user", data.token);
        setUser(data.user);
        navigate("/");
      } else {
        setOtpError(data.message || "Verification failed. Please try again.");
      }
    } catch (error) {
      console.error(
        "There was a problem with the verification request:",
        error
      );
      setOtpError("There was a problem submitting your OTP. Please try again.");
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center z-10">
      <div className="bg-primary border-[4px] border-secondary rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:border-light max-w-lg w-full">
        <div className="flex flex-col items-center justify-center py-8 px-6 space-y-6 text-gray-100 font-poppins w-full max-w-md mx-auto">
          <h1 className="text-3xl font-fredoka text-light font-semibold tracking-wider">
            Verify Your Email
          </h1>
          <p className="text-center text-gray-300 text-sm">
            Enter the 6-digit OTP sent to your email to proceed.
          </p>
          <div className="flex justify-center items-center w-full">
            <OTPInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              inputType="number"
              renderSeparator={<span className="mx-1 text-light">-</span>}
              renderInput={(props) => <input {...props} />}
              containerStyle="w-full items-center flex justify-center"
              inputStyle="text-center style-none text-4xl border-2 border-secondary rounded-md focus:outline-none focus:border-accent bg-primary text-light"
            />
          </div>
          {otpError && <p className="text-red-500 text-sm">{otpError}</p>}

          <button
            onClick={handleOTPSubmit}
            className="w-full max-w-xs py-3 bg-accent rounded-lg font-bold text-gray-900 border-[4px] border-light hover:border-primary hover:bg-light hover:text-gray-900 transition-all duration-300"
          >
            Verify OTP
          </button>
          <p className="text-sm text-gray-300">
            Didn’t receive the OTP?{" "}
            <button
              onClick={() => console.log("Resend OTP")}
              className="text-accent underline"
            >
              Resend OTP
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Verify;
