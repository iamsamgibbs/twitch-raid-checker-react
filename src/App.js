import { useState, useEffect } from "react";
import "./App.css";

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
  const clientId = "rtgfj7m5fq9afcrhidnirdej66ve7j";
  const parsedHash = new URLSearchParams(window.location.hash.slice(1));
  const accessToken = parsedHash.get("access_token");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (accessToken) {
      setLoggedIn(true);
    }
  }, [accessToken]);

  if (loggedIn) {
    try {
    } catch (err) {
      console.log(err);
    }
    return <Dashboard clientId={clientId} accessToken={accessToken} />;
  } else {
    return <Login clientId={clientId} />;
  }
}

export default App;
