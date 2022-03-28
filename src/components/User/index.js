import React from "react";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

export default function User({ userData }) {
  return (
    <Card>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar alt={userData.display_name} src={userData.profile_image_url} />
        <Typography variant="subtitle1">
          Hello {userData.display_name}!
        </Typography>
      </Stack>
    </Card>
  );
}
