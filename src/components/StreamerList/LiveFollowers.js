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
    const getData = async () => {
      try {
        let liveFollowers = [];

        do {
          let ids = allFollowerIds
            .splice(0, 100)
            .map((id) => `user_id=${id}`)
            .join("&");

          const {
            data: { data },
          } = await axios({
            url: `https://api.twitch.tv/helix/streams?${ids}`,
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Client-Id": clientId,
            },
          });

          if (data.length) liveFollowers = [...liveFollowers, ...data];
        } while (allFollowerIds.length > 0);

        liveFollowers.sort((a, b) => b.viewer_count - a.viewer_count);
        setAllLiveFollowers(liveFollowers);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    getData();
  }, [accessToken, allFollowerIds, clientId]);

  if (loading)
    return <Loading loadingMessage="Getting live follower data..." />;

  if (error)
    return <Error errorMessage="Something went wrong loading followers..." />;

  return <LiveFollowersList allLiveFollowers={allLiveFollowers} />;
}
