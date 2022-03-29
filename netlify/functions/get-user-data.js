const { twitchAPI, authenticateWithTwitch } = require("../../utils");

const getUserDataByLogin = (login) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        data: {
          data: [user],
        },
      } = await twitchAPI({
        method: "GET",
        url: `/users?login=${login}`,
      });

      if (!user) reject("User not found");

      resolve(user);
    } catch (err) {
      reject(err);
    }
  });
};

exports.handler = async function (event, context) {
  try {
    await authenticateWithTwitch();

    // login could be passed from front end etc
    const userData = await getUserDataByLogin("03gibbss");
    return {
      statusCode: 200,
      body: JSON.stringify({ userData }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Something went wrong" }),
    };
  }
};
