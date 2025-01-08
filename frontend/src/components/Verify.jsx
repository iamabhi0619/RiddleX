import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import OTPInput from "react-otp-input";
import { toast } from "react-toastify";
import userContext from "../context/userContext";

function Verify() {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setToken, setUser } = useContext(userContext);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const handleOTPSubmit = async () => {
    if (otp.length !== 6) {
      toast.error("OTP must be 6 digits.");
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/user/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp, email }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Verification failed.");
      }

      const data = await response.json();
      if (data.token) {
        setToken(data.token);
        localStorage.setItem("user", data.token);
        setUser(data.user);
        toast.success("Verification successful!");
        navigate("/");
      } else {
        toast.error(data.message || "Verification failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      toast.error(error.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await fetch("/api/user/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        throw new Error("Failed to resend OTP.");
      }
      toast.success("OTP resent successfully!");
    } catch (error) {
      console.error("Error during OTP resend:", error);
      toast.error("Failed to resend OTP. Please try again later.");
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
              isInputNum
              renderSeparator={<span className="mx-1 text-light">-</span>}
              renderInput={(props) => <input {...props} />}
              containerStyle="w-full items-center flex justify-center"
              inputStyle="text-center style-none text-4xl border-2 border-secondary rounded-md focus:outline-none focus:border-accent bg-primary text-light"
            />
          </div>
          <button
            onClick={handleOTPSubmit}
            disabled={isSubmitting}
            className={`w-full max-w-xs py-3 ${
              isSubmitting ? "bg-gray-500" : "bg-accent hover:bg-light"
            } rounded-lg font-bold text-gray-900 border-[4px] border-light transition-all duration-300`}
          >
            {isSubmitting ? "Verifying..." : "Verify OTP"}
          </button>
          <p className="text-sm text-gray-300">
            Didn’t receive the OTP?{" "}
            <button
              onClick={handleResendOTP}
              disabled={isSubmitting}
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
