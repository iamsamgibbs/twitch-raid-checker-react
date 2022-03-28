import React from "react";

import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import PersonIcon from "@mui/icons-material/Person";

import { msToTime } from "../../utils";

export default function LiveFollowerItem({ follower }) {
  // need to match follower to user to get profile image
  const elapsed = Date.now() - new Date(follower.started_at);

  const uptime = msToTime(elapsed);

  let thumbnailUrl = follower.thumbnail_url;

  thumbnailUrl = thumbnailUrl.replace("{width}", 1920);
  thumbnailUrl = thumbnailUrl.replace("{height}", 1080);

  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar alt={follower.user_name} src={thumbnailUrl} />
      </ListItemAvatar>
      <ListItemText
        primary={
          <>
            {follower.user_name} - <PersonIcon /> {follower.viewer_count}
          </>
        }
        secondary={`${follower.game_name} - ${uptime}`}
      />
    </ListItem>
  );
}

// game_id: "29595";
// game_name: "Dota 2";
// id: "45081555692";
// is_mature: true;
// language: "en";
// started_at: "2022-03-28T14:00:35Z";
// tag_ids: ["6ea6bca4-4712-4ab9-a906-e3336a9d8039"];
// thumbnail_url: "https://static-cdn.jtvnw.net/previews-ttv/live_user_gorgc-{width}x{height}.jpg";
// title: "🔴hmm🔴";
// type: "live";
// user_id: "108268890";
// user_login: "gorgc";
// user_name: "Gorgc";
// viewer_count: 17036;
