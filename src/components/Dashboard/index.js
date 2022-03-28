import React, { useEffect, useState } from "react";
import axios from "axios";

import Container from "@mui/material/Container";

import Loading from "../Loading";
import Error from "../Error";
import User from "../User";
import StreamerList from "../StreamerList";

export default function Dashboard({ clientId, accessToken }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const savedUserData = localStorage.getItem("userData");

    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
      setLoading(false);
    } else {
      const getData = async () => {
        try {
          const {
            data: {
              data: [user],
            },
          } = await axios({
            url: "https://api.twitch.tv/helix/users",
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Client-Id": clientId,
            },
          });

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
  }, [accessToken, clientId, loading]);

  return loading ? (
    <Loading loadingMessage="Getting user data..." />
  ) : error ? (
    <Error errorMessage="You are not authenticated." />
  ) : (
    <Container>
      <User userData={userData} />
      <StreamerList
        clientId={clientId}
        accessToken={accessToken}
        userData={userData}
      />
    </Container>
  );
}
