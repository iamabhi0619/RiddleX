import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Nav from "./components/Nav";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Forget from "./components/Forget";
import Main from "./components/Main";
import { Slide, ToastContainer } from "react-toastify";
import EmailVerification from "./components/EmailVerification";

function App() {
  return (
    <div className="bg-vibrant-gradient h-screen overflow-hidden">
      <Nav />
      <div className="z-20 h-full">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forget" element={<Forget />} />
          <Route path="/verify" element={<EmailVerification />} />
        </Routes>
      </div>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={4500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Slide}
      />
    </div>
  );
}

export default App;
