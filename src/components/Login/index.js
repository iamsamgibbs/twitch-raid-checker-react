import React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const short = require("short-uuid");

export default function Login({ clientId, setDemoMode }) {
  const allowDemoMode = process.env.REACT_APP_ALLOW_DEMO_MODE === "true";
  const redirectUri = process.env.REACT_APP_TWITCH_REDIRECT_URI;
  const scope = "";

  let stateToken = JSON.parse(localStorage.getItem("stateToken"));

  if (!stateToken) {
    stateToken = short.generate();
    localStorage.setItem("stateToken", JSON.stringify(stateToken));
  }

  const handleDemoMode = () => {
    setDemoMode(true);
  };

  return (
    <Box textAlign="center">
      <Typography variant="h3">Twitch Raid Checker</Typography>
      <br></br>
      <Typography>
        Shows you a list of twitch users who follow you, who are currently live,
        sorted by viewer count AKA potential raiders!
      </Typography>
      <br></br>
      <Stack spacing={2} direction="row" justifyContent="center">
        <Button
          variant="contained"
          color="secondary"
          href={`https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}&force_verify=true&state=${stateToken}`}
        >
          Login with twitch
        </Button>
        {allowDemoMode && (
          <Button variant="contained" color="primary" onClick={handleDemoMode}>
            Show me an example!
          </Button>
        )}
      </Stack>
    </Box>
  );
}
