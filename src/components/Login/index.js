import React from "react";
const short = require("short-uuid");

export default function Login({ clientId }) {
  const redirectUri = "http://localhost:3000";
  const scope = "";
  const stateToken = short.generate();

  return (
    <a
      href={`https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}&state=${stateToken}`}
    >
      Login with twitch
    </a>
  );
}
