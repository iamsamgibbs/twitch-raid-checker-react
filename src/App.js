import { useState, useEffect } from "react";
import "./App.css";

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
  const clientId = process.env.REACT_APP_TWITCH_CLIENT_ID;
  const [accessToken, setAccessToken] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("accessToken");

    if (savedToken) {
      setAccessToken(JSON.parse(savedToken));
      setLoggedIn(true);
    } else {
      const parsedHash = new URLSearchParams(window.location.hash.slice(1));
      const parsedToken = parsedHash.get("access_token");
      const parsedState = parsedHash.get("state");

      if (parsedToken && parsedState) {
        window.location.assign("/");
        const storedState = JSON.parse(localStorage.getItem("stateToken"));
        if (storedState === parsedState) {
          setAccessToken(parsedToken);
          localStorage.setItem("accessToken", JSON.stringify(parsedToken));
          setLoggedIn(true);
        } else {
          console.log("State token invalid, retry authentication");
        }
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("stateToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("followerIds");
    setLoggedIn(false);
    setDemoMode(false);
  };

  return loggedIn || demoMode ? (
    <Dashboard
      clientId={clientId}
      accessToken={accessToken}
      handleLogout={handleLogout}
      setDemoMode={setDemoMode}
      demoMode={demoMode}
    />
  ) : (
    <Login clientId={clientId} setDemoMode={setDemoMode} />
  );
}

export default App;
