import React from "react";

import Typography from "@mui/material/Typography";

export default function Loading({ loadingMessage }) {
  return (
    <>
      <br></br>
      <Typography>{loadingMessage}</Typography>
    </>
  );
}
