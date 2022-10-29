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
      color: 0xc13540,
      author: {
        name: `Azuki #${id} ${isFlagged}`,
        icon_url: `${url.azukiIcon}`,
      },
      description: `[Azuki Collector's Profile](${url.azukiProfile}/${token.owner})`,
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
      color: 0xc13540,
      author: {
        name: `Beanz #${id} ${isFlagged}`,
        icon_url: `${url.beanzIcon}`,
      },
      description: `[Beanz Collector's Profile](${url.azukiProfile}/${token.owner})`,
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
        data.openseaVerificationStatus === "verified" ? "✅" : "";
      const royalties = data.royalties?.bps ? data.royalties.bps : 0;

      const volume = function (day) {
        return `${Math.round(data.volume[day]).toLocaleString("en-US")}`;
      };

      return [
        {
          color: 0x0267bc,
          author: {
            name: `${data.name} ${verified}`,
          },
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
              value: `${roundPrice(data.floorAsk.price.amount.native, 2)} Ξ`,
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
              value: `${volume("1day")} Ξ / ${volume("7day")} Ξ / ${volume(
                "30day"
              )} Ξ / ${volume("allTime")} Ξ`,
              inline: false,
            },
            {
              name: "Contract Address",
              value: `[${address}](https://etherscan.io/address/${address})`,
              inline: false,
            },
            {
              name: "Links",
              value: `${website}[OpenSea](https://opensea.io/collection/${slug}) | [LooksRare](https://looksrare.org/collections/${address}) | [X2Y2](https://x2y2.io/collection/${slug}/items) | [Sudo](https://sudoswap.xyz/#/browse/buy/${address}) | [Gem](https://www.gem.xyz/collection/${slug}/) | [Blur](https://blur.io/collection/${slug})`,
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

export const pairEmbed = async function (azukiId, beanzId) {
  const [[azukiData], [beanzData]] = await Promise.all([
    getData(
      `https://api.reservoir.tools/tokens/v5?tokens=${contract.azuki}:${azukiId}`
    ),
    getData(
      `https://api.reservoir.tools/tokens/v5?tokens=${contract.beanz}:${beanzId}`
    ),
  ]);

  return [
    {
      color: 0xc13540,
      author: {
        name: `Azuki #${azukiId} | Beanz #${beanzId}`,
        icon_url: `${url.azukiIcon}`,
      },
      description: `[Azuki Collector's Profile](${url.azukiProfile}/${azukiData.token.owner}) | [Beanz Collector's Profile](${url.azukiProfile}/${beanzData.token.owner})`,
      fields: [
        {
          name: "Links to Azuki",
          value: tokenLinks(contract.azuki, azukiId, azukiData.token.owner),
        },
        {
          name: "Links to Beanz",
          value: tokenLinks(contract.beanz, beanzId, beanzData.token.owner),
        },
      ],
      image: {
        url: `https://azukiimagemaker.vercel.app/api/pairbeanz-prod?azukiId=${azukiId}&beanzId=${beanzId}`,
      },
      footer: {
        text: "Image may take some time to render",
      },
    },
  ];
};

export const othersEmbed = async function (interaction, id) {
  const options = {
    blue: {
      name: "Azuki",
      icon: `${url.azukiIcon}`,
      contract: `${contract.azuki}`,
      url: `https://azuki-jackets.s3.us-west-1.amazonaws.com/blue/${id}.png`,
    },
    red: {
      name: "Azuki",
      icon: `${url.azukiIcon}`,
      contract: `${contract.azuki}`,
      url: `https://azuki-jackets.s3.us-west-1.amazonaws.com/red/${id}.png`,
    },
    selfie: {
      name: "Beanz",
      icon: `${url.beanzIcon}`,
      contract: `${contract.beanz}`,
      url: `https://azkimg.imgix.net/images_squareface/final-${id}.png`,
    },
    wallpaper: {
      name: "Azuki",
      icon: `${url.azukiIcon}`,
      contract: `${contract.azuki}`,
      url: `https://azk.imgix.net/big_azukis/a-${id}.png`,
    },
  };

  const name = options[`${interaction}`].name;
  const icon = options[`${interaction}`].icon;
  const othersContract = options[`${interaction}`].contract;
  const imageUrl = options[`${interaction}`].url;

  const [data] = await getData(
    `https://api.reservoir.tools/tokens/v5?tokens=${othersContract}:${id}`
  );

  return [
    {
      color: 0xc13540,
      author: {
        name: `${name} #${id}`,
        icon_url: `${icon}`,
      },
      description: `[${name} Collector's Profile](${url.azukiProfile}/${data.token.owner})`,
      fields: [
        {
          name: "Links",
          value: tokenLinks(othersContract, id, data.token.owner),
        },
      ],
      image: {
        url: `${imageUrl}`,
      },
    },
  ];
};
