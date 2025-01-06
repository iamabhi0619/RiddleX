import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Nav from "./components/Nav";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Forget from "./components/Forget";
import Main from "./components/Main";
import Verify from "./components/Verify";

function App() {
  return (
    <div className="bg-vibrant-gradient h-screen overflow-hidden">
      <Nav />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/singup" element={<Signup />} />
        <Route path="/forget" element={<Forget />} />
        <Route path="/verify" element={<Verify />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
