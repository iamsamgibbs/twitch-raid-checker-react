const { twitchAPI, authenticateWithTwitch } = require("../../utils");

const getUserFollowerIdsById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let after = "";
      let followerIds = [];

      do {
        const {
          data: {
            data,
            pagination: { cursor },
          },
        } = await twitchAPI(
          `/users/follows?to_id=${id}&first=100&after=${after}`
        );

        followerIds = [
          ...followerIds,
          ...data.map((follower) => follower.from_id),
        ];

        after = cursor;
      } while (after !== undefined);

      resolve(followerIds);
    } catch (err) {
      reject(err);
    }
  });
};

exports.handler = async function (event, context) {
  try {
    const { userId } = JSON.parse(event.body);
    if (!userId) throw "User ID not found";

    await authenticateWithTwitch();

    const followerIds = await getUserFollowerIdsById(userId);

    return {
      statusCode: 200,
      body: JSON.stringify({ followerIds }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Something went wrong" }),
    };
  }
};
