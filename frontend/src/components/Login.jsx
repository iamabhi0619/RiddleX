import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import userContext from "../context/userContext";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: true,
  });
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state
  const { setToken, setUser } = useContext(userContext);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setLoading(true); // Start loading
    try {
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Login sucessfull..!!")
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem("user", data.token);
        navigate("/");
      } else {
        toast.error(data.message || "Login failed. Please try again.")
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again later.")
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="bg-primary border-[4px] border-secondary rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:border-light max-w-lg w-full">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center space-y-4 py-12 px-10 text-gray-100 font-poppins"
        >
          <img
            src="/assist/LogoWhite.svg"
            alt="RiddleX Logo"
            className="h-20 w-20"
          />
          <h1 className="text-3xl font-fredoka text-light">
            Sign in to RiddleX
          </h1>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 font-medium text-sm text-center">
              {error}
            </p>
          )}

          {/* Email Input */}
          <input
            className="w-full px-3 py-2 font-semibold tracking-wide text-pale bg-primary rounded-md border border-secondary focus:border-light hover:border-accent placeholder:text-white"
            placeholder="Email Or UserName"
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          {/* Password Input */}
          <input
            className="w-full px-3 py-2 font-semibold tracking-wide text-pale bg-primary rounded-md border border-secondary focus:border-light hover:border-accent placeholder:text-white"
            placeholder="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {/* Remember Me & Forgot Password */}
          <div className="flex justify-between w-full items-center">
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
                className="mr-2 w-4 h-4"
              />
              Remember me
            </label>
            <Link
              to="/forget"
              className="text-light font-medium hover:underline transition-all duration-200"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 ${
              loading ? "bg-gray-400" : "bg-accent"
            } rounded-full font-bold text-gray-900 border-[4px] border-light ${
              loading ? "cursor-not-allowed" : "hover:border-primary"
            } transition-all duration-300`}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          {/* Sign-up Redirect */}
          <p className="text-sm">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-light hover:text-accent transition-all duration-200"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
