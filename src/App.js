import { useState, useEffect } from "react";
import "./App.css";

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
  const clientId = process.env.REACT_APP_TWITCH_CLIENT_ID;
  const [accessToken, setAccessToken] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("accessToken");

    if (savedToken) {
      setAccessToken(JSON.parse(savedToken));
      setLoggedIn(true);
    } else {
      const parsedHash = new URLSearchParams(window.location.hash.slice(1));
      const parsedToken = parsedHash.get("access_token");

      if (parsedToken) {
        setAccessToken(parsedToken);
        localStorage.setItem("accessToken", JSON.stringify(parsedToken));
        setLoggedIn(true);
      }
    }
  }, []);

  return loggedIn ? (
    <Dashboard clientId={clientId} accessToken={accessToken} />
  ) : (
    <Login clientId={clientId} />
  );
}

export default App;
