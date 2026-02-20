import { Navigate, Route, Routes } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";

import { HomePage } from "./pages/HomePage";
import { Login } from "./pages/auth-froms/Login";
import { Register } from "./pages/auth-froms/Register";
import { Nav } from "./components/Nav";
import { ProfilePage } from "./pages/ProfilePage";
import { Toaster } from "react-hot-toast";

function App() {
  const { authUser, checkUser } = useAuthStore();

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  // console.log("authuser", authUser);
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      {/* <div>hello</div> */}
      <Toaster />

      <Nav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!authUser ? <Register /> : <Navigate to="/" />}
        />
        <Route path="/profile/:username" element={<ProfilePage />} />
      </Routes>
    </div>
  );
}

export default App;
