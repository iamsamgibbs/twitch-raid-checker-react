import React, { useEffect, useState } from "react";
import axios from "axios";

import Container from "@mui/material/Container";

import Loading from "../Loading";
import Error from "../Error";
import User from "../User";
import StreamerList from "../StreamerList";

export default function Dashboard({
  clientId,
  accessToken,
  handleLogout,
  demoMode,
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState({});
  const [timeUntilRefresh, setTimeUntilRefresh] = useState(0);

  useEffect(() => {
    const savedUserData = localStorage.getItem("userData");

    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
      setLoading(false);
    } else {
      const getData = async () => {
        try {
          let axiosOptions = {};

          if (demoMode) {
            axiosOptions = {
              url: `${process.env.REACT_APP_DEMO_URL}/users?login=${process.env.REACT_APP_DEMO_USER}`,
              method: "GET",
            };
          } else {
            axiosOptions = {
              url: "https://api.twitch.tv/helix/users",
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Client-Id": clientId,
              },
            };
          }

          const {
            data: {
              data: [user],
            },
          } = await axios(axiosOptions);
          setUserData(user);
          localStorage.setItem("userData", JSON.stringify(user));
          setLoading(false);
        } catch (err) {
          setError(err);
          setLoading(false);
        }
      };
      getData();
    }
  }, [accessToken, clientId, loading, demoMode]);

  return loading ? (
    <Loading loadingMessage="Getting user data..." />
  ) : error ? (
    <Error errorMessage="You are not authenticated." />
  ) : (
    <Container>
      <User
        userData={userData}
        timeUntilRefresh={timeUntilRefresh}
        handleLogout={handleLogout}
        demoMode={demoMode}
      />
      <StreamerList
        clientId={clientId}
        accessToken={accessToken}
        userData={userData}
        setTimeUntilRefresh={setTimeUntilRefresh}
        demoMode={demoMode}
      />
    </Container>
  );
}
