import { getData } from "./reservoirAPI.js";
import {
  getQueryParams,
  isVerified,
  round,
  toPercent,
  symbol,
} from "../utilities/helpers.js";

export class CollectionData {
  format(number) {
    return number.toLocaleString("en-US");
  }

  getListed(listed, supply) {
    return listed <= supply
      ? `${this.format(listed)} (${toPercent(listed, supply)}%)`
      : this.format(listed);
  }

  getRoyalty(bps) {
    return `${bps / 100}%`;
  }

  getOwners(owners, supply) {
    return owners <= supply
      ? `${this.format(owners)} (${toPercent(owners, supply)}%)`
      : this.format(owners);
  }

  getMarketplaceLogo(source) {
    switch (source) {
      case "opensea.io":
        return " | <:opensea:1061571107888574544>";
      case "gem.xyz":
        return " | <:openseapro:1093544112680083476>";
      case "looksrare.org":
        return " | <:looksrare:1061571122111463514>";
      case "x2y2.io":
        return " | <:x2y2:1061571333600837643>";
      case "sudoswap.xyz":
        return " | <:sudo:1061570522447622205>";
      case "blur.io":
        return " | <:blur:1075392456859856966>";
      case "magically.gg":
        return " | <:magically:1068776103654727711>";
      case "reservoir.market":
      case "reservoir.tools":
        return " | <:reservoir:1061296995605676062>";
      default:
        return "";
    }
  }

  getPrice(symbol, price, source) {
    return price
      ? `${symbol}${round(price, 2)}${this.getMarketplaceLogo(source)}`
      : "-";
  }

  getVolume(volume) {
    return `${symbol.eth}${this.format(round(volume, 0))}`;
  }

  getContractLink(contract) {
    return `[${contract}](https://etherscan.io/address/${contract})`;
  }

  getSocialLinks(website, twitter, discord) {
    let links = [];
    if (website) links.push(`[Website](${website})`);
    if (twitter) links.push(`[Twitter](https://twitter.com/${twitter})`);
    if (discord) links.push(`[Discord](${discord})`);

    if (!links.length) return "-";
    return links.join(" | ");
  }

  getMarketplaceLinks(contract, slug) {
    return `[OpenSea](https://opensea.io/collection/${slug}) | [OpenSea Pro](https://pro.opensea.io/collection/${slug}) | [LooksRare](https://looksrare.org/collections/${contract}) | [X2Y2](https://x2y2.io/collection/${contract}) | [Sudoswap](https://sudoswap.xyz/#/browse/buy/${contract}) | [Blur](https://blur.io/collection/${contract})\n[Magically](https://magically.gg/collection/${contract}) | [Reservoir](https://marketplace.reservoir.tools/collection/ethereum/${contract})`;
  }

  async getCollectionData(query, matchedData) {
    try {
      let data = matchedData;
      if (!data) {
        const queryParams = getQueryParams(query);
        const collection = await getData(
          `https://api.reservoir.tools/collections/v5?${queryParams}=${query}&includeTopBid=true&limit=1`
        );
        data = collection[0];
      }

      if (!data) throw Error();

      const name = data.name;
      const verification = isVerified(data.openseaVerificationStatus);
      const image = data.image;
      const supply = this.format(+data.tokenCount);
      const listed = this.getListed(+data.onSaleCount, +data.tokenCount);
      const royalty = this.getRoyalty(data.royalties.bps);
      const owners = this.getOwners(data.ownerCount, +data.tokenCount);
      const floor = this.getPrice(
        symbol.eth,
        data.floorAsk.price?.amount.native,
        data.floorAsk.sourceDomain
      );
      const bid = this.getPrice(
        symbol.weth,
        data.topBid.price?.amount.native,
        data.topBid.sourceDomain
      );
      const volume = this.getVolume(data.volume.allTime);
      const contractLink = this.getContractLink(data.id);
      const socialLinks = this.getSocialLinks(
        data.externalUrl,
        data.twitterUsername,
        data.discordUrl
      );
      const marketplaceLinks = this.getMarketplaceLinks(data.id, data.slug);

      return [
        name,
        verification,
        image,
        supply,
        listed,
        royalty,
        owners,
        floor,
        bid,
        volume,
        contractLink,
        socialLinks,
        marketplaceLinks,
      ];
    } catch (error) {
      throw error;
    }
  }
}
