import React, { useEffect, useState } from "react";
import axios from "axios";

import Loading from "../Loading";
import Error from "../Error";
import LiveFollowersList from "./LiveFollowersList";

export default function LiveFollowers({
  clientId,
  accessToken,
  allFollowerIds,
  setTimeUntilRefresh,
  demoMode,
}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [allLiveFollowers, setAllLiveFollowers] = useState([]);
  const [loadingMessage, setLoadingMessage] = useState(
    "Getting live follower data..."
  );

  const refreshRate = 300000;

  useEffect(() => {
    let refreshing = false;
    const getData = async () => {
      refreshing = true;
      try {
        let liveFollowers = [];
        let tempIds = [...allFollowerIds];

        do {
          let ids = tempIds
            .splice(0, 100)
            .map((id) => `user_id=${id}`)
            .join("&");

          let axiosOptions = {};

          if (demoMode) {
            axiosOptions = {
              url: `${process.env.REACT_APP_DEMO_URL}/streams?${ids}`,
              method: "GET",
            };
          } else {
            axiosOptions = {
              url: `https://api.twitch.tv/helix/streams?${ids}`,
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Client-Id": clientId,
              },
            };
          }

          const {
            data: { data: streams },
          } = await axios(axiosOptions);

          if (streams.length) {
            const liveIds = streams.map((d) => `id=${d.user_id}`).join("&");

            let axiosUserOptions = {};

            if (demoMode) {
              axiosUserOptions = {
                url: `${process.env.REACT_APP_DEMO_URL}/users?${liveIds}`,
                method: "GET",
              };
            } else {
              axiosUserOptions = {
                url: `https://api.twitch.tv/helix/users?${liveIds}`,
                method: "GET",
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  "Client-Id": clientId,
                },
              };
            }

            const {
              data: { data: users },
            } = await axios(axiosUserOptions);

            const combinedData = streams.map((stream) => ({
              ...stream,
              ...users.find((user) => user.id === stream.user_id),
            }));

            liveFollowers = [...liveFollowers, ...combinedData];
          }

          console.log(
            `Getting currently live followers: ${
              allFollowerIds.length - tempIds.length
            } / ${allFollowerIds.length}`
          );

          setLoadingMessage(
            `Getting currently live followers: ${
              allFollowerIds.length - tempIds.length
            } / ${allFollowerIds.length}`
          );
        } while (tempIds.length > 0);

        liveFollowers.sort((a, b) => b.viewer_count - a.viewer_count);
        setAllLiveFollowers(liveFollowers);
        refreshing = false;
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    getData();

    let remaining = refreshRate / 1000;

    const interval = setInterval(() => {
      remaining = refreshRate / 1000;
      if (!refreshing) getData();
    }, refreshRate);

    const timer = setInterval(() => {
      remaining--;
      setTimeUntilRefresh(remaining);
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, [accessToken, allFollowerIds, clientId, setTimeUntilRefresh, demoMode]);

  if (loading) return <Loading loadingMessage={loadingMessage} />;

  if (error)
    return <Error errorMessage="Something went wrong loading followers..." />;

  return <LiveFollowersList allLiveFollowers={allLiveFollowers} />;
}
