import { Navigate, Route, Routes } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";

import { HomePage } from "./pages/HomePage";
import { Login } from "./pages/auth-froms/Login";
import { Register } from "./pages/auth-froms/Register";
// /import { Nav } from "./components/Nav";
import { ProfilePage } from "./pages/ProfilePage";

function App() {
  const { authUser, checkUser } = useAuthStore();

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  // console.log("authuser", authUser);
  return (
    <div className="min-h-screen flex flex-col">
      {/* <div>hello</div> */}
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!authUser ? <Register /> : <Navigate to="/" />}
        />
        <Route path="/:username" element={<ProfilePage />} />
      </Routes>
    </div>
  );
}

export default App;
