import { getData, getOwners } from "./fetch.js";
import {
  emoji,
  azukiInfo,
  beanzInfo,
  isVerified,
  getTokenData,
  getTokenMarketplaceLinks,
  getMarketplaceLogo,
  toRound,
  toPercent,
} from "./helpers.js";

export const azukiEmbed = async (id, interaction) => {
  const [token, isFlagged, traits, links, stats] = await getTokenData(
    azukiInfo.contract,
    id
  );

  const jacketUrl = (interaction) =>
    `https://azuki-jackets.s3.us-west-1.amazonaws.com/${interaction}/${id}.png`;
  const azukiPairingUrl = (interaction) =>
    `https://azuki-pairing-images.s3.us-west-1.amazonaws.com/equip_${interaction}/${id}.png`;
  const hoodieUrl = (interaction) =>
    `https://azukibuilder.vercel.app/api/build_s1_azuki?azukiId=${id}&equip=%22ambush-${interaction}%22`;

  const options = {
    azuki: `https://ikzttp.mypinata.cloud/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/${id}.png`,
    profile: `https://azk.imgix.net/big_azukis/a-${id}.png`,
    dragon: `https://azk.imgix.net/dragon_azukis/ikz1_${id}.png?w=4000`,
    blue: jacketUrl(interaction),
    red: jacketUrl(interaction),
    rbr: azukiPairingUrl(interaction),
    santa: azukiPairingUrl(interaction),
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
      description: `[Azuki Collector's Profile](${azukiInfo.profile}/${token.owner})`,
      fields: [
        ...traits,
        {
          name: "Marketplace Links",
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
  const [token, isFlagged, traits, links, stats] = await getTokenData(
    beanzInfo.contract,
    id
  );

  const beanzUrl = (type = "", query = "") =>
    `https://azkimg.imgix.net/images${type}/final-${id}.png${query}`;
  const beanzPairingUrl = (type) =>
    `https://azuki-pairing-images.s3.us-west-1.amazonaws.com/beanz_equip_${type}/${id}.png`;

  const options = {
    beanz: beanzUrl(),
    transparent: beanzUrl("_no_bg"),
    selfie: beanzUrl("_squareface"),
    portrait: beanzUrl(
      "",
      "?fp-z=1.72&crop=focalpoint&fit=crop&fp-y=0.4&fp-x=0.505"
    ),
    beanz_santa: beanzPairingUrl("santa"),
  };

  return [
    {
      color: 0x0267bc,
      author: {
        name: `Beanz #${id} ${isFlagged}`,
        icon_url: beanzInfo.icon,
      },
      description: `[Beanz Collector's Profile](${azukiInfo.profile}/${token.owner})`,
      fields: [
        ...traits,
        {
          name: "Marketplace Links",
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
      description: `[Azuki Collector's Profile](${azukiInfo.profile}/${azukiData.token.owner}) | [Bean Collector's Profile](${azukiInfo.profile}/${beanzData.token.owner})`,
      image: {
        url: `https://azukiimagemaker.vercel.app/api/pairbeanz-prod?azukiId=${azukiId}&beanzId=${beanzId}`,
      },
      footer: {
        text: "Image may take some time to render",
      },
    },
  ];
};

export const collectionEmbed = async (contract) => {
  const [[data], [owners, topHolder], [floorListing]] = await Promise.all([
    getData(
      `https://api.reservoir.tools/collections/v5?contract=${contract}&includeTopBid=true&useNonFlaggedFloorAsk=true&limit=1`
    ),
    getOwners(
      `https://api.reservoir.tools/collections/${contract}/owners-distribution/v1`
    ),
    getData(
      `https://api.reservoir.tools/orders/asks/v4?contracts=${contract}&status=active&sortBy=price&limit=1`
    ),
  ]);

  const slug = data.slug;
  const supply = Number(data.tokenCount);
  const listings = Number(data.onSaleCount);
  const royalties = data.royalties?.bps ?? 0;

  const collectionFp = data.floorAsk.price?.amount.native;
  const listingFp = floorListing?.price.amount.native;
  const floorPrice =
    collectionFp >= listingFp
      ? `${toRound(collectionFp, 2)}${getMarketplaceLogo(
          data.floorAsk.sourceDomain
        )}`
      : `${toRound(listingFp, 2)}${getMarketplaceLogo(
          floorListing?.source.domain
        )}`;

  const website =
    data.externalUrl !== null ? `[Website](${data.externalUrl})` : "";
  const twitter =
    data.twitterUsername !== null
      ? `[Twitter](https://twitter.com/${data.twitterUsername})`
      : "";
  const discord =
    data.discordUrl !== null ? `[Discord](${data.discordUrl})` : "";
  const socialLinks =
    website || twitter || discord
      ? [website, twitter, discord].join(" ").trim().replaceAll(" ", " | ")
      : "-";

  return [
    {
      color: 0x0267bc,
      title: `${data.name} ${isVerified(data.openseaVerificationStatus, true)}`,
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
          value: `${listings.toLocaleString("en-US")} ${toPercent(
            listings,
            supply
          )}`,
          inline: true,
        },
        {
          name: "Royalties",
          value: `${royalties / 100}%`,
          inline: true,
        },
        {
          name: "Owners",
          value: `${owners.toLocaleString("en-US")} ${toPercent(
            owners,
            supply
          )}`,
          inline: true,
        },
        {
          name: "Floor Price",
          value: `${emoji.eth}${floorPrice}`,
          inline: true,
        },
        {
          name: "Total Volume",
          value: `${emoji.eth}${Math.round(data.volume.allTime).toLocaleString(
            "en-US"
          )}`,
          inline: true,
        },
        {
          name: "Top Holder",
          value: `${topHolder.toLocaleString("en-US")} ${toPercent(
            topHolder,
            supply
          )}`,
          inline: true,
        },
        {
          name: "Top Bid",
          value: `${emoji.weth}${toRound(
            data.topBid.price?.amount.native,
            2
          )}${getMarketplaceLogo(data.topBid?.sourceDomain)}`,
          inline: true,
        },
        {
          name: "\u200b",
          value: "\u200b",
          inline: true,
        },
        {
          name: "Contract Address",
          value: `[${contract}](https://etherscan.io/address/${contract})`,
        },
        {
          name: "Social Links",
          value: `${socialLinks}`,
        },
        {
          name: "Marketplace Links",
          value: `[OpenSea](https://opensea.io/collection/${slug}) | [LooksRare](https://looksrare.org/collections/${contract}) | [X2Y2](https://x2y2.io/collection/${contract}) | [Sudoswap](https://sudoswap.xyz/#/browse/buy/${contract}) | [Gem](https://www.gem.xyz/collection/${contract})\n[Blur](https://blur.io/collection/${contract}) | [Magically](https://magically.gg/collection/${contract}) | [Reservoir](https://www.reservoir.market/collections/${contract})`,
        },
        {
          name: "Tools",
          value: `[NFTFlip](https://review.nftflip.ai/collection/${contract}) | [NFTNerds](https://nftnerds.ai/collection/${contract})`,
        },
      ],
    },
  ];
};

export const tokenEmbed = async (contract, id) => {
  try {
    const [token, isFlagged, traits, links, stats] = await getTokenData(
      contract,
      id
    );

    return [
      {
        color: 0x0267bc,
        author: {
          name: `${token.collection.name} #${id} ${isFlagged}`,
          icon_url: token.collection.image,
        },
        fields: [
          ...traits,
          {
            name: "Marketplace Links",
            value: links,
          },
        ],
        image: {
          url: token.image,
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
    `https://api.reservoir.tools/orders/asks/v4?contracts=${contract}&status=active&includeCriteriaMetadata=true&sortBy=price&limit=10`
  );

  let tokens = "",
    listPrice = "",
    listExpire = "";

  listings.forEach((listing) => {
    tokens += `${listing.criteria.data.token.name}\n\n`;

    listPrice += `${emoji.eth}${toRound(
      listing.price.amount.native,
      2
    )}${getMarketplaceLogo(listing.source.domain)}\n\n`;

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
        url: listings[0].criteria.data.collection.image,
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

export const monitorEmbed = (token, fiatPrice) => {
  return [
    {
      color: 0x0267bc,
      author: {
        name: `${token.token.tokenName}`,
        icon_url: token.collection.collectionImage,
      },
      description: `[Collector's Profile](${azukiInfo.profile}/${token.fromAddress})`,
      fields: [
        {
          name: "List Price",
          value: `${emoji.eth}${toRound(
            token.price,
            2
          )} ($${fiatPrice.toLocaleString("en-US")})${getMarketplaceLogo(
            token.order.source.domain
          )}`,
          inline: false,
        },
        {
          name: "Marketplace Links",
          value: getTokenMarketplaceLinks(
            token.collection.collectionId,
            token.token.tokenId
          ),
        },
      ],
      image: {
        url: token.token.tokenImage,
      },
      footer: {
        icon_url:
          "https://cdn.discordapp.com/attachments/957980880251531264/1063870693193830420/BLUEBEAN.gif",
        text: "Powered by bluebeanfam",
      },
      timestamp: new Date(Date.now()).toISOString(),
    },
  ];
};
