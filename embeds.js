import { getData, getOwners, refreshToken } from "./fetch.js";
import {
  url,
  azukiInfo,
  beanzInfo,
  tokenHelper,
  sortTraits,
  marketplace,
  toRound,
  toPercent,
} from "./helpers.js";

export const azukiEmbed = async (id, interaction) => {
  const [token, isFlagged, links, footer] = await tokenHelper(
    azukiInfo.contract,
    id
  );

  const options = {
    azuki: `https://ikzttp.mypinata.cloud/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/${id}.png`,
    blue: `https://azuki-jackets.s3.us-west-1.amazonaws.com/blue/${id}.png
        `,
    red: `https://azuki-jackets.s3.us-west-1.amazonaws.com/red/${id}.png
        `,
    wallpaper: `https://azk.imgix.net/big_azukis/a-${id}.png
        `,
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
        text: footer,
      },
    },
  ];
};

export const beanzEmbed = async (id, interaction) => {
  const [token, isFlagged, links, footer] = await tokenHelper(
    beanzInfo.contract,
    id
  );

  const options = {
    beanz: `https://ikzttp.mypinata.cloud/ipfs/QmTRuWHr7bpqscUWFmhXndzf5AdQqkekhqwgbyJCqKMHrL/${id}.png`,
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
        text: footer,
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
  const [[owners, mostHeld], dailySales] = await Promise.all([
    getOwners(
      `https://api.reservoir.tools/collections/${contract}/owners-distribution/v1`
    ),
    getData(
      `https://api.reservoir.tools/collections/daily-volumes/v1?id=${contract}&limit=2`
    ),
  ]);

  const slug = data.slug;
  const size = Number(data.tokenCount);
  const listings = Number(data.onSaleCount);

  const isVerified =
    data.openseaVerificationStatus === "verified"
      ? "<a:verified:1036933625289134100>"
      : "";
  const royalties = data.royalties?.bps ?? 0;
  const dailySale = dailySales.at(0)?.sales_count ?? 0;

  let percentChange = "";
  if (dailySales.length === 2) {
    const today = dailySales.at(0).sales_count;
    const yesterday = dailySales.at(1).sales_count;
    const difference = today - yesterday;
    const formula = (difference / yesterday) * 100;
    percentChange =
      difference >= 0
        ? `(+${toRound(formula, 1)}%)`
        : `(${toRound(formula, 1, true)}%)`;
  }

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
      fields: [
        {
          name: "Collection Size",
          value: `${size.toLocaleString("en-US")}`,
          inline: true,
        },
        {
          name: "Listings",
          value: `${listings.toLocaleString("en-US")} (${toPercent(
            listings,
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
          value: `${url.eth}${toRound(
            data.floorAsk.price.amount.native,
            2
          )}${marketplace(data.floorAsk.sourceDomain)}`,
          inline: true,
        },
        {
          name: "Owners",
          value: `${owners.toLocaleString("en-US")} (${toPercent(
            owners,
            size
          )}%)`,
          inline: true,
        },
        {
          name: "Most Held",
          value: `${mostHeld.toLocaleString("en-US")} (${toPercent(
            mostHeld,
            size
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
          name: "Daily Sale(s)",
          value: `${dailySale.toLocaleString("en-US")} ${percentChange}`,
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
          inline: true,
        },
        {
          name: "Collection Links",
          value: `${website}${discord}[OpenSea](https://opensea.io/collection/${slug}) | [LooksRare](https://looksrare.org/collections/${contract}) | [X2Y2](https://x2y2.io/collection/${slug}/items) | [Sudo](https://sudoswap.xyz/#/browse/buy/${contract}) | [Blur](https://blur.io/collection/${slug}) | [Gem](https://www.gem.xyz/collection/${slug}/)`,
        },
        {
          name: "Tools",
          value: `[AlphaSharks](https://vue.alphasharks.io/collection/${contract}) | [NFTFlip](https://review.nftflip.ai/collection/${contract}) | [NFTNerds](https://nftnerds.ai/collection/${contract})`,
        },
      ],
    },
  ];
};

export const tokenEmbed = async (data, id, contract) => {
  try {
    const [token, isFlagged, links, footer] = await tokenHelper(
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
          text: footer,
        },
      },
    ];
  } catch (error) {
    throw Error(error.message);
  }
};
