import { getReservoirData } from "./fetch.js";
import { monitorEmbed } from "./embeds.js";

// let previousListing = [];
// const hasListing = (listing) =>
//   listing.token.tokenId === previousListing[0].token.tokenId &&
//   listing.timestamp === previousListing[0].timestamp;

// export const monitor = async function (webhook) {
//   const listings = await getReservoirData(
//     `https://api.reservoir.tools/collections/activity/v5?community=azuki&limit=50&types=ask`
//   );
//   if (!previousListing.length) {
//     previousListing.push(listings[0]);
//     return;
//   }

//   const newListing = listings.findIndex(hasListing);

//   if (!newListing) return;

//   for (let i = newListing - 1; i >= 0; i--) {
//     if (listings[i].collection.collectionName === "Bobu, the Bean Farmer")
//       continue;

//     webhook.send({
//       username: "blue bean",
//       avatarURL:
//         "https://azkimg.imgix.net/images/final-19789.png?fp-z=1.72&crop=focalpoint&fit=crop&fp-y=0.4&fp-x=0.505",
//       embeds: monitorEmbed(listings[i]),
//     });
//   }

//   previousListing[0] = listings[0];
// };

export class Monitor {
  previousData = [];

  constructor(community, type, webhook, delay) {
    this.community = community;
    this.type = type;
    this.webhook = webhook;
    this.delay = delay;
  }

  _matchData = (data) =>
    data.token.tokenId === this.previousData[0].token.tokenId &&
    data.timestamp === this.previousData[0].timestamp;

  _updateWebhook(data, index, webhook) {
    for (let i = index - 1; i >= 0; i--) {
      if (data[i].collection.collectionName === "Bobu, the Bean Farmer")
        continue;

      webhook.send({
        username: "blue bean",
        avatarURL:
          "https://azkimg.imgix.net/images/final-19789.png?fp-z=1.72&crop=focalpoint&fit=crop&fp-y=0.4&fp-x=0.505",
        embeds: monitorEmbed(data[i]),
      });
    }
  }

  async _monitor(community, type, webhook) {
    const data = await getReservoirData(
      `https://api.reservoir.tools/collections/activity/v5?community=${community}&types=${type}`
    );

    if (!this.previousData.length) {
      this.previousData.push(data[0]);
      return;
    }

    const newDataIndex = data.findIndex(this._matchData);
    if (!newDataIndex) return;

    this._updateWebhook(data, newDataIndex, webhook);

    this.previousData[0] = data[0];
  }

  startMonitor() {
    setInterval(async () => {
      await this._monitor(this.community, this.type, this.webhook);
    }, this.delay);
  }
}
