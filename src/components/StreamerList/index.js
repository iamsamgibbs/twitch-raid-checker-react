import React, { useEffect, useState } from "react";
import axios from "axios";

import Loading from "../Loading";
import Error from "../Error";
import LiveFollowers from "./LiveFollowers";

export default function StreamerList({
  clientId,
  accessToken,
  userData,
  setTimeUntilRefresh,
  demoMode,
}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [allFollowerIds, setAllFollowerIds] = useState([]);
  const [loadingMessage, setLoadingMessage] = useState(
    "Getting follower data..."
  );

  useEffect(() => {
    const getData = async () => {
      try {
        let after = "";
        let followerIds = [];

        do {
          let axiosOptions = {};

          if (demoMode) {
            axiosOptions = {
              url: `${process.env.REACT_APP_DEMO_URL}/users/follows?to_id=${userData.id}&first=100&after=${after}`,
              method: "GET",
            };
          } else {
            axiosOptions = {
              url: `https://api.twitch.tv/helix/users/follows?to_id=${userData.id}&first=100&after=${after}`,
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Client-Id": clientId,
              },
            };
          }

          const {
            data: {
              data,
              pagination: { cursor },
              total,
            },
          } = await axios(axiosOptions);

          followerIds = [
            ...followerIds,
            ...data.map((follower) => follower.from_id),
          ];

          setLoadingMessage(
            `Loading ${followerIds.length} / ${total} followers...`
          );

          after = cursor;
        } while (after !== undefined);

        setAllFollowerIds(followerIds);
        localStorage.setItem(
          "followerIds",
          JSON.stringify({
            expires_at: Date.now() + 24 * 60 * 60 * 1000,
            ids: followerIds,
          })
        );
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    const savedFollowerIds = localStorage.getItem("followerIds");

    if (savedFollowerIds) {
      const parsed = JSON.parse(savedFollowerIds);
      const expiresAt = parsed.expires_at;

      if (Date.now() < new Date(expiresAt)) {
        setAllFollowerIds(parsed.ids);
        setLoading(false);
      } else {
        getData();
      }
    } else {
      getData();
    }
  }, [accessToken, clientId, userData.id, demoMode]);

  return loading ? (
    <Loading loadingMessage={loadingMessage} />
  ) : error ? (
    <Error errorMessage="Something went wrong loading followers..." />
  ) : (
    <LiveFollowers
      clientId={clientId}
      accessToken={accessToken}
      allFollowerIds={allFollowerIds}
      setTimeUntilRefresh={setTimeUntilRefresh}
      demoMode={demoMode}
    />
  );
}
