import { getReservoirData } from "./fetch.js";
import { monitorEmbed } from "./embeds.js";

let previousListing = [];
const hasListing = (listing) =>
  listing.token.tokenId === previousListing[0].token.tokenId &&
  listing.timestamp === previousListing[0].timestamp;

export const monitor = async function (webhook) {
  const listings = await getReservoirData(
    `https://api.reservoir.tools/collections/activity/v5?community=azuki&limit=20&types=ask`
  );
  if (!previousListing.length) {
    previousListing.push(listings[0]);
    return;
  }

  const newListing = listings.findIndex(hasListing);

  if (!newListing) return;

  for (let i = newListing - 1; i >= 0; i--) {
    webhook.send({
      username: "blue bean",
      avatarURL:
        "https://media.discordapp.net/attachments/891506947457712188/1064082031463645264/blue_bean.png?width=671&height=671",
      embeds: monitorEmbed(listings[i]),
    });
  }

  previousListing[0] = listings[0];
};
