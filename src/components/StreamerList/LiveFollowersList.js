import React from "react";

import List from "@mui/material/List";

import LiveFollowerItem from "./LiveFollowerItem";

export default function LiveFollowersList({ allLiveFollowers }) {
  return (
    <List dense>
      {allLiveFollowers.map((follower) => (
        <LiveFollowerItem key={follower.id} follower={follower} />
      ))}
    </List>
  );
}
