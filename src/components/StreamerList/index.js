import React, { useEffect, useState } from "react";
import axios from "axios";

import Loading from "../Loading";
import Error from "../Error";
import LiveFollowers from "./LiveFollowers";

export default function StreamerList({ clientId, accessToken, userData }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [allFollowerIds, setAllFollowerIds] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        let after = "";
        let followerIds = [];
        do {
          const {
            data: {
              data,
              pagination: { cursor },
            },
          } = await axios({
            url: `https://api.twitch.tv/helix/users/follows?to_id=${userData.id}&first=100&after=${after}`,
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Client-Id": clientId,
            },
          });

          followerIds = [
            ...followerIds,
            ...data.map((follower) => follower.from_id),
          ];

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
  }, [accessToken, clientId, userData.id]);

  return loading ? (
    <Loading loadingMessage="Getting follower data..." />
  ) : error ? (
    <Error errorMessage="Something went wrong loading followers..." />
  ) : (
    <LiveFollowers
      clientId={clientId}
      accessToken={accessToken}
      allFollowerIds={allFollowerIds}
    />
  );
}
