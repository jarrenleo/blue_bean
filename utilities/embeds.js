export const collectionEmbed = ([
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
]) => {
  return [
    {
      color: 0x0267bc,
      title: `${name} ${verification}`,
      thumbnail: {
        url: image,
      },
      fields: [
        {
          name: "Supply",
          value: supply,
          inline: true,
        },
        {
          name: "Listed",
          value: listed,
          inline: true,
        },
        {
          name: "Royalty",
          value: royalty,
          inline: true,
        },
        {
          name: "Owners",
          value: owners,
          inline: true,
        },
        {
          name: "Floor Price",
          value: floor,
          inline: true,
        },
        {
          name: "Top Bid",
          value: bid,
          inline: true,
        },
        {
          name: "Total Volume",
          value: volume,
          inline: false,
        },
        {
          name: "Contract Address",
          value: contractLink,
          inline: false,
        },
        {
          name: "Social Links",
          value: socialLinks,
          inline: false,
        },
        {
          name: "Marketplace Links",
          value: marketplaceLinks,
          inline: false,
        },
      ],
      timestamp: new Date(Date.now()).toISOString(),
    },
  ];
};

export const tokenEmbed = ([
  icon,
  name,
  isFlagged,
  rarity,
  attribute,
  link,
  image,
  statistic,
]) => {
  return [
    {
      color: 0x0267bc,
      author: {
        name: `${name} ${isFlagged}`,
        icon_url: icon,
      },
      description: rarity,
      fields: [...attribute, ...link],
      image: {
        url: image,
      },
      footer: {
        text: statistic,
      },
    },
  ];
};
