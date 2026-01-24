import { useUser } from "@clerk/clerk-react";

import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./Components/Pages/Home.jsx";
import Problems from "./Components/Pages/Problems.jsx";
import ProblemPage from "./Components/Pages/ProblemPage.jsx";
import About from "./Components/Pages/About.jsx";
import { Toaster } from "react-hot-toast";
import Dashboard from "./Components/Pages/Dashboard.jsx";
import SessionPage from "./Components/Pages/SessionPage.jsx";
import { StreamProvider } from "./Components/StreamProvider.jsx";

// Wrap SessionPage with StreamProvider
const SessionPageWithStream = () => (
  <StreamProvider>
    <SessionPage />
  </StreamProvider>
);

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
          path="/problems"
          element={isSignedIn ? <Problems /> : <Navigate to="/" />}
        />
        <Route
          path="/problem/:problemId"
          element={isSignedIn ? <ProblemPage /> : <Navigate to="/" />}
        />
        <Route
          path="/session/:sessionId"
          element={isSignedIn ? <SessionPageWithStream /> : <Navigate to="/" />}
        />
      </Routes>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1d232a",
            color: "#a6adbb",
            border: "1px solid #373f47",
          },
          success: {
            iconTheme: {
              primary: "#36d399",
              secondary: "#1d232a",
            },
          },
          error: {
            iconTheme: {
              primary: "#f87272",
              secondary: "#1d232a",
            },
          },
        }}
      />
    </div>
  );
}

export default App;
