import { getData } from "./reservoirAPI.js";
import {
  isETHAddress,
  round,
  toPercent,
  isAzukiCommunity,
  symbol,
  timeIntervals,
} from "../utilities/helpers.js";

export class TokenData {
  async getContract(name) {
    const data = await getData(
      `https://api.reservoir.tools/collections/v5?name=${name}&limit=1`
    );

    return data[0].id;
  }

  getFlagStatus(status) {
    return status ? "⚠️" : "";
  }

  getRarity(rank) {
    return rank ? `**Rarity #${rank}**` : "**Rarity #0**";
  }

  generatePadding(requiredPadding) {
    return new Array(requiredPadding).fill({
      name: "\u200b",
      value: "\u200b",
      inline: true,
    });
  }

  getAttributes(attributes, supply) {
    const attributeField = attributes.map((attribute) => {
      const price = attribute.floorAskPrice
        ? `${symbol.eth}${round(attribute.floorAskPrice, 2)}`
        : "";
      const rarityPercentage =
        attribute.tokenCount <= supply
          ? `(${toPercent(attribute.tokenCount, supply)}%)`
          : "";

      return {
        name: `${attribute.key}`,
        value: `${attribute.value}\n${rarityPercentage}\n${price}`,
        inline: true,
      };
    });

    const requiredPadding = 3 - (attributes.length % 3);
    if (requiredPadding === 3) return attributeField;

    const paddingField = this.generatePadding(requiredPadding);
    return attributeField.concat(paddingField);
  }

  getLinks(contract, id, slug, owner) {
    const linkField = [
      {
        name: "Marketplace Links",
        value: `[OpenSea](https://opensea.io/assets/ethereum/${contract}/${id}) | [OpenSea Pro](https://pro.opensea.io/collection/${slug}?view=${id}&tokenAddress=${contract}) | [LooksRare](https://looksrare.org/collections/${contract}/${id}) | [X2Y2](https://x2y2.io/eth/${contract}/${id})\n[Sudoswap](https://sudoswap.xyz/#/item/${contract}/${id}) | [Blur](https://blur.io/asset/${contract}/${id}) | [Reservoir](https://marketplace.reservoir.tools/collection/ethereum/${contract}/${id})`,
      },
    ];

    if (isAzukiCommunity(slug))
      linkField.unshift({
        name: "Social Link",
        value: `[Azuki Collector's Profile](https://www.azuki.com/collector/${owner})`,
      });

    return linkField;
  }

  getHoldDuration = (timestamp) => {
    const timeDifference = Date.now() / 1000 - timestamp;

    for (const timeInterval of timeIntervals) {
      if (timeDifference < timeInterval.seconds) continue;

      const dp = timeInterval.unit !== "year" ? 0 : 1;
      return `${round(timeDifference / timeInterval.seconds, dp)} ${
        timeInterval.unit
      }(s)`;
    }
  };

  getStatistics(floorAsk, sale, bid, lastTransfer) {
    const listPrice = floorAsk ? `⟠ ${round(floorAsk, 2)}` : "-";
    const topBid = bid ? `⟠ ${round(bid, 2)}` : "-";
    const lastSale = sale ? `⟠ ${round(sale, 2)}` : "-";
    const holdDuration = this.getHoldDuration(lastTransfer);

    return `List Price: ${listPrice} | Last Sale: ${lastSale} | Top Bid: ${topBid}\nHold Duration: ${holdDuration}`;
  }

  async getTokenData(contract, id) {
    try {
      let primaryContract = contract;
      if (!isETHAddress(contract)) {
        const name = contract;
        primaryContract = await this.getContract(name);
      }

      const [token, collection, transfer] = await Promise.all([
        getData(
          `https://api.reservoir.tools/tokens/v6?tokens=${primaryContract}:${id}&includeTopBid=true&includeAttributes=true&includeLastSale=true`
        ),
        getData(
          `https://api.reservoir.tools/collections/v5?contract=${primaryContract}`
        ),
        getData(
          `https://api.reservoir.tools/transfers/v3?token=${primaryContract}:${id}&limit=1`
        ),
      ]);

      const data = token[0];
      if (!data) throw Error();
      const icon = data.token.collection.image;
      const name = data.token.name;
      const isFlagged = this.getFlagStatus(data.token.isFlagged);
      const rarity = this.getRarity(data.token.rarityRank);
      const attribute = this.getAttributes(
        data.token.attributes,
        collection[0].tokenCount
      );
      const link = this.getLinks(
        primaryContract,
        id,
        data.token.collection.slug,
        data.token.owner
      );
      const image = data.token.image;
      const statistic = this.getStatistics(
        data.market.floorAsk.price?.amount.native,
        data.token.lastSale?.price.amount.native,
        data.market.topBid.price?.amount.native,
        transfer[0].timestamp
      );

      return [icon, name, isFlagged, rarity, attribute, link, image, statistic];
    } catch (error) {
      throw error;
    }
  }
}
