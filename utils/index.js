const axios = require("axios");

const twitchAPI = axios.create({
  baseURL: "https://api.twitch.tv/helix/",
  headers: {
    "Client-Id": process.env.REACT_APP_TWITCH_CLIENT_ID,
  },
});

const authenticateWithTwitch = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        data: { access_token: accessToken },
      } = await axios({
        method: "POST",
        url: "https://id.twitch.tv/oauth2/token",
        data: {
          client_id: process.env.REACT_APP_TWITCH_CLIENT_ID,
          client_secret: process.env.TWITCH_CLIENT_SECRET,
          grant_type: "client_credentials",
        },
      });

      twitchAPI.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${accessToken}`;

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {
  twitchAPI,
  authenticateWithTwitch,
};
