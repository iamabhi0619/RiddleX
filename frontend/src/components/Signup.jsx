import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Signup() {
  const [signupData, setSignupData] = useState({
    userId: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    dp: null,
  });

  const [errors, setErrors] = useState({});
  const [userIdAvailable, setUserIdAvailable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [dpPreview, setDpPreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserIdAvailability = async () => {
      if (signupData.userId.length >= 3) {
        try {
          const response = await fetch(
            `/api/checkUserId?userId=${signupData.userId}`
          );
          const data = await response.json();
          setUserIdAvailable(data.isAvailable);
        } catch (error) {
          console.error("Error checking userId availability:", error);
        }
      }
    };

    checkUserIdAvailability();
  }, [signupData.userId]);

  const validateForm = () => {
    const newErrors = {};

    if (!signupData.name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!/^\S+@\S+\.\S+$/.test(signupData.email)) {
      newErrors.email = "Invalid email address.";
    }

    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[A-Z]).{8,}$/;
    if (!passwordPattern.test(signupData.password)) {
      newErrors.password =
        "Password must be at least 8 characters, with 1 uppercase and 1 number.";
    }

    if (signupData.password !== signupData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (!signupData.gender) {
      newErrors.gender = "Gender is required.";
    }

    if (!userIdAvailable) {
      newErrors.userId = "User ID is already taken.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setSignupData({
        ...signupData,
        dp: files[0],
      });
      setDpPreview(URL.createObjectURL(files[0]));
    } else {
      setSignupData({
        ...signupData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        const formData = new FormData();
        Object.entries(signupData).forEach(([key, value]) => {
          formData.append(key, value);
        });

        const response = await fetch("/api/user/signup", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          toast.error("Network response was not ok")
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        if (data.userResponse) {
          toast.info("Please verify you Email...!!")
          navigate("/verify", { state: { email: signupData.email } });
        }
      } catch (error) {
        console.error("Error during signup:", error);
        setErrors({ form: "An error occurred. Please try again later." });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center z-10">
      <div className="bg-primary border-[4px] border-secondary rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:border-light max-w-lg w-full">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center py-4 space-y-4 px-6 text-gray-100 font-poppins"
        >
          <h1 className="text-3xl font-fredoka text-light font-semibold tracking-wider">
            Join our Community
          </h1>

          {/* Error Message */}
          {errors.form && (
            <p className="text-red-500 text-sm text-center">{errors.form}</p>
          )}

          {/* UserId Input */}
          <input
            className={`w-full px-3 py-2 font-semibold tracking-wide text-pale bg-primary rounded-md border ${
              errors.userId ? "border-red-500" : "border-secondary"
            } focus:border-light hover:border-accent placeholder:text-white`}
            placeholder="User ID"
            type="text"
            name="userId"
            value={signupData.userId}
            onChange={handleChange}
            required
          />
          {errors.userId && (
            <p className="text-red-500 text-sm">{errors.userId}</p>
          )}

          {/* Name Input */}
          <input
            className={`w-full px-3 py-2 font-semibold tracking-wide text-pale bg-primary rounded-md border ${
              errors.name ? "border-red-500" : "border-secondary"
            } focus:border-light hover:border-accent placeholder:text-white`}
            placeholder="Full Name"
            type="text"
            name="name"
            value={signupData.name}
            onChange={handleChange}
            required
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          {/* Email Input */}
          <input
            className={`w-full px-3 py-2 font-semibold tracking-wide text-pale bg-primary rounded-md border ${
              errors.email ? "border-red-500" : "border-secondary"
            } focus:border-light hover:border-accent placeholder:text-white`}
            placeholder="Email"
            type="email"
            name="email"
            value={signupData.email}
            onChange={handleChange}
            required
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}

          {/* Password Input */}
          <input
            className={`w-full px-3 py-2 font-semibold tracking-wide text-pale bg-primary rounded-md border ${
              errors.password ? "border-red-500" : "border-secondary"
            } focus:border-light hover:border-accent placeholder:text-white`}
            placeholder="Password"
            type="password"
            name="password"
            value={signupData.password}
            onChange={handleChange}
            required
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}

          {/* Confirm Password Input */}
          <input
            className={`w-full px-3 py-2 font-semibold tracking-wide text-pale bg-primary rounded-md border ${
              errors.confirmPassword ? "border-red-500" : "border-secondary"
            } focus:border-light hover:border-accent placeholder:text-white`}
            placeholder="Confirm Password"
            type="password"
            name="confirmPassword"
            value={signupData.confirmPassword}
            onChange={handleChange}
            required
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
          )}

          {/* Gender Input */}
          <select
            className={`w-full px-3 py-2 font-semibold tracking-wide text-pale bg-primary rounded-md border ${
              errors.gender ? "border-red-500" : "border-secondary"
            } focus:border-light hover:border-accent placeholder:text-white`}
            name="gender"
            value={signupData.gender}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && (
            <p className="text-red-500 text-sm">{errors.gender}</p>
          )}

          {/* Profile Picture Upload */}
          <input
            className="w-full px-3 py-2 font-semibold tracking-wide text-pale bg-primary rounded-md border border-secondary focus:border-light hover:border-accent placeholder:text-white"
            type="file"
            name="dp"
            onChange={handleChange}
            accept="image/*"
          />
          {dpPreview && (
            <img
              src={dpPreview}
              alt="Profile Preview"
              className="w-20 h-20 rounded-full mt-2"
            />
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 rounded-full font-bold text-gray-900 border-[4px] transition-all duration-300 ${
              loading
                ? "bg-gray-500 border-gray-400 cursor-not-allowed"
                : "bg-accent border-light hover:border-primary"
            }`}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
          <p className="text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-light hover:text-accent transition-all duration-200"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
