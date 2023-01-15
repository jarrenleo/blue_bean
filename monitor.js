import { fetchData, getData } from "./fetch.js";
import { toRound } from "./helpers.js";
import { monitorEmbed } from "./embeds.js";

let previousListings = [];
let currentListings = [];

const hasListings = function (currentListing) {
  for (const previousListing of previousListings)
    if (
      previousListing.id === currentListing.id &&
      previousListing.timestamp === currentListing.timestamp
    )
      return true;

  return false;
};

export const monitor = async function (webhook) {
  const [listings, price] = await Promise.all([
    getData(
      `https://api.reservoir.tools/collections/activity/v5?community=azuki&types=ask`
    ),
    fetchData(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
      {}
    ),
  ]);

  currentListings = [];

  for (let i = listings.length - 1; i >= 0; i--) {
    const token = {
      icon: listings.at(i).collection.collectionImage,
      name: listings.at(i).token.tokenName,
      price: toRound(listings.at(i).price, 2),
      image: listings.at(i).token.tokenImage,
      owner: listings.at(i).fromAddress,
      source: listings.at(i).order.source.domain,
      contract: listings.at(i).collection.collectionId,
      id: listings.at(i).token.tokenId,
      timestamp: listings.at(i).timestamp,
    };

    currentListings.push(token);
  }

  for (const currentListing of currentListings) {
    if (!previousListings.length) break;
    if (hasListings(currentListing)) continue;

    webhook.send({
      username: "blue bean",
      avatarURL:
        "https://media.discordapp.net/attachments/891506947457712188/1064082031463645264/blue_bean.png?width=671&height=671",
      embeds: monitorEmbed(currentListing, price.ethereum.usd),
    });
  }

  previousListings = [];
  previousListings = currentListings;
};
