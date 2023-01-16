import { fetchData, getData } from "./fetch.js";
import { monitorEmbed } from "./embeds.js";

let previousListings = [];

const hasListing = function (listings) {
  for (const previousListing of previousListings)
    if (
      previousListing.token.tokenId === listings.token.tokenId &&
      previousListing.timestamp === listings.timestamp
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

  for (let i = listings.length - 1; i >= 0; i--) {
    if (!previousListings.length) break;
    if (hasListing(listings[i])) continue;

    const token = {
      icon: listings.at(i).collection.collectionImage,
      name: listings.at(i).token.tokenName,
      id: listings.at(i).token.tokenId,
      price: listings.at(i).price,
      image: listings.at(i).token.tokenImage,
      owner: listings.at(i).fromAddress,
      source: listings.at(i).order.source.domain,
      contract: listings.at(i).collection.collectionId,
    };
    const fiatPrice = Number((token.price * price.ethereum.usd).toFixed());

    webhook.send({
      username: "blue bean",
      avatarURL:
        "https://media.discordapp.net/attachments/891506947457712188/1064082031463645264/blue_bean.png?width=671&height=671",
      embeds: monitorEmbed(token, fiatPrice),
    });
  }

  previousListings = [];
  previousListings = listings;
};
