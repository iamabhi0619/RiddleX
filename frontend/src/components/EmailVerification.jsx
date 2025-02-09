import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

export default function EmailVerification() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      setStatus("invalid");
    }
  }, [token]);

  const verifyEmail = async (token) => {
    try {
      const response = await axios.post("api/user/verify", { token });
      if (response.data.success) {
        setStatus("success");
      } else {
        setStatus("failed");
      }
    } catch (error) {
      setStatus("failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="w-96 bg-primary border-4 text-xl font-bold tracking-wide font-poppins border-light shadow-md rounded-lg p-6 text-center hover:border-accent">
        {status === "pending" && <p className="text-gray-600">Verifying...</p>}
        {status === "success" && <p className="text-green-600">Email verified successfully! ✅</p>}
        {status === "failed" && <p className="text-red-600">Verification failed. ❌</p>}
        {status === "invalid" && <p className="text-yellow-600">Invalid verification link.</p>}
        <button className="mt-4 px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-700" onClick={() => window.location.href = "/login"}>Go to Login</button>
      </div>
    </div>
  );
}
