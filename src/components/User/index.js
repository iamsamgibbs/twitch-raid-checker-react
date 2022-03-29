import React from "react";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import { msToTime } from "../../utils";

export default function User({ userData, timeUntilRefresh, setLoggedIn }) {
  const handleLogout = () => {
    localStorage.removeItem("stateToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("followerIds");
    setLoggedIn(false);
  };
  return (
    <Card>
      <Box m={0.5}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-around"
          spacing={2}
        >
          <Avatar
            alt={userData.display_name}
            src={userData.profile_image_url}
          />
          <Typography variant="subtitle1">
            Hello {userData.display_name}! - Next refresh:{" "}
            {msToTime(timeUntilRefresh * 1000, "ms")}
          </Typography>
          <Button variant="contained" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </Stack>
      </Box>
    </Card>
  );
}
