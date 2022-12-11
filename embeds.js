import { getData, getOwners, refreshToken } from "./fetch.js";
import {
  url,
  azukiInfo,
  beanzInfo,
  getTokenData,
  sortTraits,
  getMarketplace,
  toRound,
  toPercent,
} from "./helpers.js";

export const azukiEmbed = async (id, interaction) => {
  const [token, isFlagged, links, stats] = await getTokenData(
    azukiInfo.contract,
    id
  );

  const jacketUrl = (interaction) =>
    `https://azuki-jackets.s3.us-west-1.amazonaws.com/${interaction}/${id}.png`;

  const hoodieUrl = (interaction) =>
    `https://azukibuilder.vercel.app/api/build_s1_azuki?azukiId=${id}&equip=%22ambush-${interaction}%22`;

  const options = {
    azuki: `https://ikzttp.mypinata.cloud/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/${id}.png`,
    profile: `https://azk.imgix.net/big_azukis/a-${id}.png`,
    blue: jacketUrl(interaction),
    red: jacketUrl(interaction),
    racing: `https://azuki-pairing-images.s3.us-west-1.amazonaws.com/equip_rbr/${id}.png`,
    white: hoodieUrl(interaction),
    black: hoodieUrl(interaction),
    bblue: hoodieUrl(interaction),
    bred: hoodieUrl(interaction),
    bwater: hoodieUrl(interaction),
    bfire: hoodieUrl(interaction),
    bearth: hoodieUrl(interaction),
    belectric: hoodieUrl(interaction),
    gold: hoodieUrl(interaction),
    spirit: hoodieUrl(interaction),
  };

  return [
    {
      color: 0x0267bc,
      author: {
        name: `Azuki #${id} ${isFlagged}`,
        icon_url: azukiInfo.icon,
      },
      description: `[Azuki Collector's Profile](${url.profile}/${token.owner})`,
      fields: [
        ...sortTraits(token.attributes, 10000),
        {
          name: "Links",
          value: links,
        },
      ],
      image: {
        url: options[`${interaction}`],
      },
      footer: {
        text: stats,
      },
    },
  ];
};

export const beanzEmbed = async (id, interaction) => {
  const [token, isFlagged, links, stats] = await getTokenData(
    beanzInfo.contract,
    id
  );

  const options = {
    beanz: `https://ikzttp.mypinata.cloud/ipfs/QmTRuWHr7bpqscUWFmhXndzf5AdQqkekhqwgbyJCqKMHrL/${id}.png`,
    transparent: `https://azkimg.imgix.net/images_no_bg/final-${id}.png`,
    selfie: `https://azkimg.imgix.net/images_squareface/final-${id}.png`,
  };

  return [
    {
      color: 0x0267bc,
      author: {
        name: `Beanz #${id} ${isFlagged}`,
        icon_url: beanzInfo.icon,
      },
      description: `[Beanz Collector's Profile](${url.profile}/${token.owner})`,
      fields: [
        ...sortTraits(token.attributes, 19950),
        {
          name: "Links",
          value: links,
        },
      ],
      image: {
        url: options[`${interaction}`],
      },
      footer: {
        text: stats,
      },
    },
  ];
};

export const pairEmbed = async (azukiId, beanzId) => {
  const [[azukiData], [beanzData]] = await Promise.all([
    getData(
      `https://api.reservoir.tools/tokens/v5?tokens=${azukiInfo.contract}:${azukiId}`
    ),
    getData(
      `https://api.reservoir.tools/tokens/v5?tokens=${beanzInfo.contract}:${beanzId}`
    ),
  ]);

  return [
    {
      color: 0x0267bc,
      author: {
        name: `Azuki #${azukiId} | Beanz #${beanzId}`,
        icon_url: azukiInfo.icon,
      },
      description: `[Azuki Collector's Profile](${url.profile}/${azukiData.token.owner}) | [Bean Collector's Profile](${url.profile}/${beanzData.token.owner})`,
      image: {
        url: `https://azukiimagemaker.vercel.app/api/pairbeanz-prod?azukiId=${azukiId}&beanzId=${beanzId}`,
      },
      footer: {
        text: "Image may take some time to render",
      },
    },
  ];
};

export const collectionEmbed = async (data, contract) => {
  const [[owners, topHolder], dailySales, stats] = await Promise.all([
    getOwners(
      `https://api.reservoir.tools/collections/${contract}/owners-distribution/v1`
    ),
    getData(
      `https://api.reservoir.tools/collections/daily-volumes/v1?id=${contract}&limit=2`
    ),
    getData(`https://api.reservoir.tools/stats/v2?collection=${contract}`),
  ]);

  const slug = data.slug;
  const supply = Number(data.tokenCount);
  const listings = Number(data.onSaleCount);

  const isVerified =
    data.openseaVerificationStatus === "verified"
      ? "<a:verified:1036933625289134100>"
      : "";
  const royalties = data.royalties?.bps ?? 0;
  const dailySale = dailySales.at(0)?.sales_count ?? 0;

  let percentChange = "";
  if (dailySales.length > 1) {
    const today = dailySales.at(0).sales_count;
    const yesterday = dailySales.at(1).sales_count;
    const difference = today - yesterday;
    const getPercentChange = (difference / yesterday) * 100;
    percentChange =
      difference > 0
        ? `(+${toRound(getPercentChange, 1)}%)`
        : `(${toRound(getPercentChange, 1, true)}%)`;
  }

  const flaggedTokens = stats.flaggedTokenCount;
  const hasFlaggedTokens = flaggedTokens
    ? `(${toPercent(flaggedTokens, supply)}%)`
    : "";

  const website =
    data.externalUrl !== null ? `[Website](${data.externalUrl}) | ` : "";
  const discord =
    data.discordUrl !== null ? `[Discord](${data.discordUrl}) | ` : "";

  return [
    {
      color: 0x0267bc,
      title: `${data.name} ${isVerified}`,
      thumbnail: {
        url: data.image,
      },
      timestamp: `${new Date(Date.now()).toISOString()}`,
      fields: [
        {
          name: "Supply",
          value: `${supply.toLocaleString("en-US")}`,
          inline: true,
        },
        {
          name: "Listings",
          value: `${listings.toLocaleString("en-US")} (${toPercent(
            listings,
            supply
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
          value: `${url.eth}${toRound(
            data.floorAsk.price.amount.native,
            2
          )}${getMarketplace(data.floorAsk.sourceDomain)}`,
          inline: true,
        },
        {
          name: "Owners",
          value: `${owners.toLocaleString("en-US")} (${toPercent(
            owners,
            supply
          )}%)`,
          inline: true,
        },
        {
          name: "Top Holder",
          value: `${topHolder.toLocaleString("en-US")} (${toPercent(
            topHolder,
            supply
          )}%)`,
          inline: true,
        },
        {
          name: "Total Volume",
          value: `${url.eth}${Math.round(data.volume.allTime).toLocaleString(
            "en-US"
          )}`,
          inline: true,
        },
        {
          name: "Daily Sales",
          value: `${dailySale.toLocaleString("en-US")} ${percentChange}`,
          inline: true,
        },
        {
          name: "Flagged Tokens",
          value: `${flaggedTokens.toLocaleString("en-US")} ${hasFlaggedTokens}`,
          inline: true,
        },
        {
          name: "Contract Address",
          value: `[${contract}](https://etherscan.io/address/${contract})`,
          inline: true,
        },
        {
          name: "Collection Links",
          value: `${website}${discord}[OpenSea](https://opensea.io/collection/${slug}) | [LooksRare](https://looksrare.org/collections/${contract}) | [X2Y2](https://x2y2.io/collection/${slug}/items) | [Sudo](https://sudoswap.xyz/#/browse/buy/${contract}) | [Blur](https://blur.io/collection/${slug}) | [Gem](https://www.gem.xyz/collection/${slug}/)`,
        },
        {
          name: "Tools",
          value: `[AlphaSharks](https://vue.alphasharks.io/collection/${contract}) | [NFTFlip](https://review.nftflip.ai/collection/${contract}) | [NFTNerds](https://nftnerds.ai/collection/${contract}) | [Reservoir](https://www.reservoir.market/collections/${contract})`,
        },
      ],
    },
  ];
};

export const tokenEmbed = async (data, id, contract) => {
  try {
    const [token, isFlagged, links, stats] = await getTokenData(
      contract,
      id,
      data.name
    );

    const image = token?.image;
    const attributes = token.attributes;
    if (!image || !attributes.length) {
      const response = await refreshToken(
        "https://api.reservoir.tools/tokens/refresh/v1",
        contract,
        id
      );
      if (response.status === 200)
        throw new Error(
          `Metadata not found for ${data.name} #${id}. A metadata refresh has been requested. Please try again in a few minutes.`
        );
      else throw new Error(`Metadata not found for ${data.name} #${id}`);
    }

    return [
      {
        color: 0x0267bc,
        author: {
          name: `${token.collection.name} #${id} ${isFlagged}`,
          icon_url: token.collection.image,
        },
        fields: [
          ...sortTraits(attributes, Number(data.tokenCount)),
          {
            name: "Links",
            value: links,
          },
        ],
        image: {
          url: image,
        },
        footer: {
          text: stats,
        },
      },
    ];
  } catch (error) {
    throw Error(error.message);
  }
};

export const listingsEmbed = async (contract, name, links) => {
  const listings = await getData(
    `https://api.reservoir.tools/orders/asks/v4?contracts=${contract}&status=active&includeCriteriaMetadata=true&sortBy=price&limit=15`
  );

  let tokens = "",
    listPrice = "",
    listExpire = "";

  listings.forEach((listing) => {
    tokens += `${listing.criteria.data.token.name}\n\n`;

    listPrice += `${url.eth}${toRound(
      listing.price.amount.native,
      2
    )}${getMarketplace(listing.source.domain)}\n\n`;

    const timestamp = listing.validUntil
      ? `<t:${listing.validUntil}:R>\n\n`
      : "-\n\n";
    listExpire += timestamp;
  });

  return [
    {
      color: 0x0267bc,
      title: name,
      thumbnail: {
        url: listings.at(0).criteria.data.collection.image,
      },
      timestamp: `${new Date(Date.now()).toISOString()}`,
      fields: [
        {
          name: "Tokens",
          value: tokens,
          inline: true,
        },
        {
          name: "List Price",
          value: listPrice,
          inline: true,
        },
        {
          name: "List Expire",
          value: listExpire,
          inline: true,
        },
        {
          name: "Collection Address",
          value: `[${contract}](https://etherscan.io/address/${contract})`,
        },
        ...links,
      ],
    },
  ];
};
