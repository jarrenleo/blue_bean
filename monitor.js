import { fetchData, getData } from "./fetch.js";
import { monitorEmbed } from "./embeds.js";

let previousListing = [];
const hasListing = (listing) =>
  listing.token.tokenId === previousListing.at(0).token.tokenId &&
  listing.timestamp === previousListing.at(0).timestamp;

export const monitor = async function (webhook) {
  const [listings, price] = await Promise.all([
    getData(
      `https://api.reservoir.tools/collections/activity/v5?community=azuki&limit=20&types=ask`
    ),
    fetchData(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
      {}
    ),
  ]);

  if (!previousListing.length) {
    previousListing.push(listings[0]);
    return;
  }

  const newListing = listings.findIndex(hasListing);

  if (!newListing) return;

  for (let i = newListing - 1; i >= 0; i--) {
    const fiatPrice = Number(
      (listings.at(i).price * price.ethereum.usd).toFixed()
    );

    webhook.send({
      username: "blue bean",
      avatarURL:
        "https://media.discordapp.net/attachments/891506947457712188/1064082031463645264/blue_bean.png?width=671&height=671",
      embeds: monitorEmbed(listings[i], fiatPrice),
    });
  }

  previousListing[0] = listings[0];
};
