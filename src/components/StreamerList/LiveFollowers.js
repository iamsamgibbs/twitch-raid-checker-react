import React, { useEffect, useState } from "react";
import axios from "axios";

import Loading from "../Loading";
import Error from "../Error";
import LiveFollowersList from "./LiveFollowersList";

export default function LiveFollowers({
  clientId,
  accessToken,
  allFollowerIds,
}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [allLiveFollowers, setAllLiveFollowers] = useState([]);

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

          const {
            data: { data: streams },
          } = await axios({
            url: `https://api.twitch.tv/helix/streams?${ids}`,
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Client-Id": clientId,
            },
          });

          if (streams.length) {
            const liveIds = streams.map((d) => `id=${d.user_id}`).join("&");

            const {
              data: { data: users },
            } = await axios({
              url: `https://api.twitch.tv/helix/users?${liveIds}`,
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Client-Id": clientId,
              },
            });

            const combinedData = streams.map((stream) => ({
              ...stream,
              ...users.find((user) => user.id === stream.user_id),
            }));

            liveFollowers = [...liveFollowers, ...combinedData];
          }
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

    const interval = setInterval(() => {
      if (!refreshing) getData();
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, [accessToken, allFollowerIds, clientId]);

  if (loading)
    return <Loading loadingMessage="Getting live follower data..." />;

  if (error)
    return <Error errorMessage="Something went wrong loading followers..." />;

  return <LiveFollowersList allLiveFollowers={allLiveFollowers} />;
}
