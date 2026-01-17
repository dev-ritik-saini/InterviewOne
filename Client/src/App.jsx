import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";

import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./Components/Pages/Home.jsx";
import Problem from "./Components/Pages/Problem.jsx";
import About from "./Components/Pages/About.jsx";
import { Toaster } from "react-hot-toast";
import Dashboard from "./Components/Pages/Dashboard.jsx";

function App() {
  const { isSignedIn, isLoaded } = useUser();
  if (!isLoaded) return null;
  return (
    <div data-theme="dark">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/dashboard"
          element={isSignedIn ? <Dashboard /> : <Navigate to="/" />}
        />

        <Route
          path="/problem"
          element={isSignedIn ? <Problem /> : <Navigate to="/" />}
        />
      </Routes>

      <Toaster toastOptions={{ duration: 3000 }} />
    </div>
  );
}

export default App;
