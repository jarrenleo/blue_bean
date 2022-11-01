import { getData, getOwners, refreshToken } from "./fetch.js";
import {
  contract,
  url,
  promiseHelper,
  sortTraits,
  tokenLinks,
  roundPrice,
  toPercent,
} from "./helpers.js";

export const azukiEmbed = async function (id) {
  const [[{ token }], list, lastSale] = await promiseHelper(contract.azuki, id);
  const isFlagged = token.isFlagged ? "⚠️" : "";

  return [
    {
      color: 0x0267bc,
      author: {
        name: `Azuki #${id} ${isFlagged}`,
        icon_url: `${url.azukiIcon}`,
      },
      description: `[Azuki Collector's Profile](${url.profile}/${token.owner})`,
      fields: [
        ...sortTraits(token.attributes, 10000),
        {
          name: "Links",
          value: tokenLinks(contract.azuki, id, token.owner),
        },
      ],
      image: {
        url: `https://ikzttp.mypinata.cloud/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/${id}.png`,
      },
      footer: {
        text: `Rarity: #${token.rarityRank} | List Price: ${list} | Last Sale: ${lastSale}`,
      },
    },
  ];
};

export const beanzEmbed = async function (id) {
  const [[{ token }], list, lastSale] = await promiseHelper(contract.beanz, id);
  const isFlagged = token.isFlagged ? "⚠️" : "";

  return [
    {
      color: 0x0267bc,
      author: {
        name: `Beanz #${id} ${isFlagged}`,
        icon_url: `${url.beanzIcon}`,
      },
      description: `[Beanz Collector's Profile](${url.profile}/${token.owner})`,
      fields: [
        ...sortTraits(token.attributes, 19950),
        {
          name: "Links",
          value: tokenLinks(contract.beanz, id, token.owner),
        },
      ],
      image: {
        url: `https://ikzttp.mypinata.cloud/ipfs/QmTRuWHr7bpqscUWFmhXndzf5AdQqkekhqwgbyJCqKMHrL/${id}.png`,
      },
      footer: {
        text: `Rarity: #${token.rarityRank} | List Price: ${list} | Last Sale: ${lastSale}`,
      },
    },
  ];
};

export const findEmbed = async function (data, name, id) {
  try {
    if (!data)
      [data] = await getData(
        `https://api.reservoir.tools/collections/v5?name=${name}&limit=1`
      );

    const address = data?.primaryContract;
    if (!address)
      throw new Error(
        "Collection not found. Please use suggested options that best match your query."
      );

    if (id === undefined) {
      const [uniqueOwners, [dailySaleCount]] = await Promise.all([
        getOwners(
          `https://api.reservoir.tools/collections/${address}/owners-distribution/v1`
        ),
        getData(
          `https://api.reservoir.tools/collections/daily-volumes/v1?id=${address}&limit=1`
        ),
      ]);

      const slug = data.slug;
      const size = Number(data.tokenCount);
      const onSale = Number(data.onSaleCount);
      const dailySale = dailySaleCount?.sales_count
        ? dailySaleCount.sales_count
        : "0";
      const website =
        data.externalUrl !== null ? `[Website](${data.externalUrl}) | ` : "";
      const verified =
        data.openseaVerificationStatus === "verified"
          ? "<a:verified:1036933625289134100>"
          : "";
      const royalties = data.royalties?.bps ? data.royalties.bps : 0;

      const volume = function (day) {
        return `${Math.round(data.volume[day]).toLocaleString("en-US")}`;
      };

      return [
        {
          color: 0x0267bc,
          title: `${data.name} ${verified}`,
          thumbnail: {
            url: `${data.image}`,
          },
          fields: [
            {
              name: "Collection Size",
              value: `${size.toLocaleString("en-US")}`,
              inline: true,
            },
            {
              name: "Active Listings",
              value: `${onSale.toLocaleString("en-US")} (${toPercent(
                onSale,
                size
              )}%)`,
              inline: true,
            },
            {
              name: "Royalties",
              value: `${royalties / 100}%`,
              inline: true,
            },
            {
              name: "Floor Price",
              value: `${url.ethEmoji}${roundPrice(
                data.floorAsk.price.amount.native,
                2
              )}`,
              inline: true,
            },
            {
              name: "Unique Owners",
              value: `${uniqueOwners.toLocaleString("en-US")} (${toPercent(
                uniqueOwners,
                size
              )}%)`,
              inline: true,
            },
            {
              name: "Daily Sale Count",
              value: `${dailySale.toLocaleString("en-US")}`,
              inline: true,
            },
            {
              name: "Volume (1 / 7 / 30 / All-Time)",
              value: `${url.ethEmoji}${volume("1day")} /${url.ethEmoji}${volume(
                "7day"
              )} /${url.ethEmoji}${volume("30day")} /${url.ethEmoji}${volume(
                "allTime"
              )}`,
              inline: false,
            },
            {
              name: "Contract Address",
              value: `[${address}](https://etherscan.io/address/${address})`,
              inline: false,
            },
            {
              name: "Marketplace",
              value: `${website}[OpenSea](https://opensea.io/collection/${slug}) | [LooksRare](https://looksrare.org/collections/${address}) | [X2Y2](https://x2y2.io/collection/${slug}/items) | [Sudo](https://sudoswap.xyz/#/browse/buy/${address}) | [Blur](https://blur.io/collection/${slug}) | [Gem](https://www.gem.xyz/collection/${slug}/)`,
            },
            {
              name: "Tools",
              value: `[AlphaSharks](https://vue.alphasharks.io/collection/${address}) | [NFTFlip](https://review.nftflip.ai/collection/${address}) | [NFTNerds](https://nftnerds.ai/collection/${address})`,
            },
          ],
        },
      ];
    }

    if (id >= 0) {
      const [[tokenData], list, lastSale] = await promiseHelper(address, id);
      const token = tokenData?.token;
      if (!token)
        throw new Error(
          `${data.name} #${id} does not exist in the collection.`
        );

      const image = token?.image;
      const attributes = token.attributes;
      if (!image || !attributes.length) {
        const response = await refreshToken(
          "https://api.reservoir.tools/tokens/refresh/v1",
          address,
          id
        );
        if (response.status === 200)
          throw new Error(
            `Metadata not found for ${data.name} #${id}. A metadata refresh has been requested. Please try again in a few minutes.`
          );
      }

      const isFlagged = token.isFlagged ? "⚠️" : "";
      const rarity = token.rarityRank !== null ? `#${token.rarityRank}` : "-";

      return [
        {
          color: 0x0267bc,
          author: {
            name: `${token.collection.name} #${id} ${isFlagged}`,
            icon_url: `${token.collection.image}`,
          },
          fields: [
            ...sortTraits(attributes, Number(data.tokenCount)),
            {
              name: "Links",
              value: tokenLinks(token.contract, id, token.owner),
            },
          ],
          image: {
            url: `${image}`,
          },
          footer: {
            text: `Rarity: ${rarity} | List Price: ${list} | Last Sale: ${lastSale}`,
          },
        },
      ];
    }
  } catch (error) {
    throw Error(error.message);
  }
};

export const othersEmbed = async function (commandName, azukiId, beanzId) {
  const options = {
    "blue-jacket": {
      name: `Azuki #${azukiId}`,
      icon: `${url.azukiIcon}`,
      url: `https://azuki-jackets.s3.us-west-1.amazonaws.com/blue/${azukiId}.png`,
    },
    "red-jacket": {
      name: `Azuki #${azukiId}`,
      icon: `${url.azukiIcon}`,
      url: `https://azuki-jackets.s3.us-west-1.amazonaws.com/red/${azukiId}.png`,
    },
    wallpaper: {
      name: `Azuki #${azukiId}`,
      icon: `${url.azukiIcon}`,
      url: `https://azk.imgix.net/big_azukis/a-${azukiId}.png`,
    },
    selfie: {
      name: `Beanz #${beanzId}`,
      icon: `${url.beanzIcon}`,
      url: `https://azkimg.imgix.net/images_squareface/final-${beanzId}.png`,
    },
    pair: {
      name: `Azuki #${azukiId} | Beanz #${beanzId}`,
      icon: `${url.azukiIcon}`,
      url: `https://azukiimagemaker.vercel.app/api/pairbeanz-prod?azukiId=${azukiId}&beanzId=${beanzId}`,
    },
  };

  return [
    {
      color: 0x0267bc,
      author: {
        name: `${options[`${commandName}`].name}`,
        icon_url: `${options[`${commandName}`].icon}`,
      },
      image: {
        url: `${options[`${commandName}`].url}`,
      },
    },
  ];
};
